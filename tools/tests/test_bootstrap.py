"""Regression checks for bootstrap gates; these are not application tests."""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from status.render import load_board, render
from verify import verify


class BootstrapTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "docs/milestones").mkdir(parents=True)
        (self.root / "docs/testing").mkdir(parents=True)
        (self.root / "docs/milestones/CURRENT").write_text("M0\n", encoding="utf-8")
        (self.root / "docs/testing/test-matrix.md").write_text("| BOOT-01 | unit | planned | fixture |\n", encoding="utf-8")
        (self.root / "README.md").write_text("# Overview\n\n## Repeated\n\n## Repeated\n\n[valid](#repeated-1)\n\n```md\n[ignored](missing.md)\n```\n", encoding="utf-8")
        self.board = {"exit_criteria": ["Reviewed"], "validates_against": ["Fixture"], "blockers": [], "tasks": [{"id": "M0-01", "title": "Check", "package": "docs", "owner": "docs-writer", "reviewers": ["test-engineer"], "state": "in review", "blocked_by": [], "adr": None, "matrix": ["BOOT-01"], "spec": ["README.md#overview"], "docs": ["README.md"], "notes": "Review pending"}]}
        self.save()

    def tearDown(self):
        self.temp.cleanup()

    def save(self):
        (self.root / "docs/milestones/M0.yaml").write_text(json.dumps(self.board), encoding="utf-8")

    def status(self):
        (self.root / "STATUS.md").write_text(render(self.root), encoding="utf-8")

    def test_valid_links_and_deterministic_render(self):
        self.status()
        self.assertEqual(render(self.root), render(self.root))
        self.assertEqual([], verify(self.root))

    def test_drift_detected(self):
        self.status()
        self.board["tasks"][0]["state"] = "open"
        self.save()
        self.assertTrue(any("drift" in error for error in verify(self.root)))

    def test_bad_state(self):
        self.board["tasks"][0]["state"] = "shipped"
        self.save()
        with self.assertRaisesRegex(ValueError, "invalid state"):
            load_board(self.root)

    def test_unknown_dependency(self):
        self.board["tasks"][0]["blocked_by"] = ["M0-99"]
        self.save()
        with self.assertRaisesRegex(ValueError, "invalid dependency"):
            load_board(self.root)

    def test_dependency_cycle(self):
        second = dict(self.board["tasks"][0], id="M0-02", blocked_by=["M0-01"])
        self.board["tasks"].append(second)
        self.board["tasks"][0]["blocked_by"] = ["M0-02"]
        self.save()
        with self.assertRaisesRegex(ValueError, "cycle"):
            load_board(self.root)

    def test_completed_task_cannot_skip_dependency(self):
        second = dict(self.board["tasks"][0], id="M0-02", state="merged", blocked_by=["M0-01"])
        self.board["tasks"].append(second)
        self.save()
        with self.assertRaisesRegex(ValueError, "completed before"):
            load_board(self.root)

    def test_missing_required_board_field(self):
        del self.board["tasks"][0]["docs"]
        self.save()
        with self.assertRaisesRegex(ValueError, "docs must be"):
            load_board(self.root)

    def test_missing_matrix_case(self):
        self.board["tasks"][0]["matrix"] = ["UNKNOWN-01"]
        self.save()
        self.status()
        self.assertTrue(any("unknown test matrix" in error for error in verify(self.root)))

    def test_missing_anchor_and_reference(self):
        self.status()
        with (self.root / "README.md").open("a", encoding="utf-8") as file:
            file.write("\n[bad](#absent)\n[other][undefined]\n")
        errors = verify(self.root)
        self.assertTrue(any("missing anchor" in error for error in errors))
        self.assertTrue(any("missing reference definition" in error for error in errors))

    def test_local_link_cannot_escape_repository(self):
        self.status()
        with (self.root / "README.md").open("a", encoding="utf-8") as file:
            file.write("\n[escape](../outside.md)\n")
        self.assertTrue(any("escapes repository" in error for error in verify(self.root)))


if __name__ == "__main__":
    unittest.main()

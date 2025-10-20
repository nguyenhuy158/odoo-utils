# Purpose
Automate patch release workflow with a clean repository:
- Stage and commit any uncommitted changes first
- Run tests before publishing
- Stop if tests fail
- If tests pass, run `npm run pub:patch`
- Commit patch changes, push to GitHub, and create a tag automatically

# Examples
Input: made small bug fix in core module
Output:
# clean repo: stage and commit all current changes
git add .
git commit -m "chore(core): clean repo before release"
# run tests
npm test
# if tests pass
npm run pub:patch
# generate commit message from .github/prompts/commit.prompt.md
git add .
git commit -m "bug(core): fix small bug"
git push
git tag v1.0.1
git push origin v1.0.1

# Prompt
You are an assistant that automates patch release workflow:

1. Stage and commit any uncommitted changes to clean the repository first.
2. Run `npm test`. Stop if tests fail.
3. Run `npm run pub:patch` if tests pass.
4. Stage all new changes from publishing, commit with concise message in format `<type>(<scope>): <message>` (generate message from `.github/prompts/commit.prompt.md`).
5. Push code to GitHub.
6. Tag release and push the tag.

Return only the exact commands to execute in bash.

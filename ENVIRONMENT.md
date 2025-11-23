# Environment Variables Reference

## Setup

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys for manual testing

## Variables

### API Keys

**ANTHROPIC_API_KEY**
- Required for: AI-powered code analysis and documentation generation
- Get from: https://console.anthropic.com/
- Used by: AI agents (code analysis, documentation writer, meta-analysis)
- Testing: Automatically mocked during `npm test`

**GITHUB_TOKEN**
- Required for: Private repositories and avoiding rate limits
- Optional for: Public repositories (but recommended)
- Get from: https://github.com/settings/tokens
- Permissions needed: `repo` (for private repos) or `public_repo` (for public only)
- Testing: Automatically mocked during `npm test`

### Server Configuration

**PORT**
- Default: `3000`
- Purpose: HTTP server port for dashboard

**WIKI_PATH**
- Default: `./wiki`
- Purpose: Directory where generated wiki files are stored

### Cost Control

**MAX_DAILY_COST**
- Default: `10` (USD)
- Purpose: Maximum daily spending on AI API calls
- System will pause processing when approaching this limit

### Processing

**META_ANALYSIS_FREQUENCY**
- Default: `5`
- Purpose: Run meta-analysis every N commits
- Meta-analysis identifies themes and suggests documentation improvements

### Testing

**TEST_MODE**
- Default: `false` (manual use), `true` (during tests)
- Purpose: Force use of mocks even with real API keys present
- Automatically set to `true` when running `npm test`

## Testing vs Manual Use

### During Tests (`npm test`)
- ✅ All API calls are automatically mocked
- ✅ No real API keys needed
- ✅ No actual API costs incurred
- ✅ Fast and deterministic
- ✅ TEST_MODE automatically set to `true`

### Manual Testing
- 🔑 Requires real API keys in `.env`
- 💰 Will make actual API calls (costs apply)
- 🌐 Connects to real GitHub and Anthropic APIs
- ⚙️ Set TEST_MODE=false (default)

## Security

**⚠️ Never commit `.env` file!**

The `.env` file is automatically ignored by git. It contains sensitive API keys that should never be committed to version control.

✅ Safe to commit:
- `.env.example` (template without real keys)
- `ENVIRONMENT.md` (this file)

❌ Never commit:
- `.env` (contains real API keys)

## Validation

The system validates configuration on startup. Missing required values will show helpful error messages:

```javascript
const config = require('./lib/config');
const validation = config.validate();

if (!validation.valid) {
  console.error('Configuration errors:');
  validation.errors.forEach(err => console.error('  -', err));
  process.exit(1);
}
```

## Example Configuration

### Development (manual testing)
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
GITHUB_TOKEN=ghp_xxx...
PORT=3000
WIKI_PATH=./wiki
MAX_DAILY_COST=5
META_ANALYSIS_FREQUENCY=5
TEST_MODE=false
```

### Production
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
GITHUB_TOKEN=ghp_xxx...
PORT=8080
WIKI_PATH=/var/wiki
MAX_DAILY_COST=50
META_ANALYSIS_FREQUENCY=10
TEST_MODE=false
```

### Testing (automated)
```env
# Not needed - tests automatically set TEST_MODE=true
# and use mock values
```

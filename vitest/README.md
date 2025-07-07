# Test Suite Documentation

## Overview

The test suite is organized into unit tests and integration tests, with shared utilities and mocks to reduce boilerplate and ensure consistency.

## Test Structure

```
vitest/
├── setup.ts                    # Global test setup and shared mocks
├── utils/
│   └── test-helpers.ts         # Shared test utilities and helpers
├── api/
│   ├── elements.structure.test.ts  # Structure tests (exports only)
│   ├── elements.integration.test.ts  # Integration tests (gated)
│   └── content.test.ts         # Content API tests
└── verification.test.ts        # Basic verification tests
```

## Shared Mocks

All mocks are centralized in `vitest/setup.ts`:

- **Sanity Client**: Mocked API client with all methods
- **NextAuth**: Session management for authentication testing
- **Rate Limiting**: Rate limit checking and header generation
- **Next.js Components**: Router, Image, Link components

## Test Utilities

### `createTestRequest(options)`

Builds a `NextRequest` object for testing API routes with minimal boilerplate:

```typescript
const request = createTestRequest({
  method: "POST",
  path: "/api/elements",
  query: { limit: "10" },
  headers: { "x-custom": "value" },
  body: { title: { en: "Test" } },
});
```

### `assertHeaders(response, options)`

Validates that specified headers are present and valid:

```typescript
const response = await fetch("/api/elements");
assertHeaders(response, { rateLimit: true, security: true });
```

### `assertApiResponseStructure(response, data)`

Ensures API responses follow the expected structure:

```typescript
const response = await fetch("/api/elements");
const data = await response.json();
assertApiResponseStructure(response, data);
```

### Session Helpers

```typescript
import {
  createMockAdminSession,
  createMockUserSession,
} from "../utils/test-helpers";

// Mock admin session
vi.mocked(getServerSession).mockResolvedValue(createMockAdminSession() as any);

// Mock user session
vi.mocked(getServerSession).mockResolvedValue(createMockUserSession() as any);
```

### Sample Documents

```typescript
import { sampleElements } from "../utils/test-helpers";

// Use predefined sample elements for testing
const testImage = sampleElements.image;
const testVideo = sampleElements.video;
const testText = sampleElements.text;
```

## Running Tests

### Unit Tests (Default)

```bash
npm run test:unit
```

### Integration Tests (Gated)

```bash
npm run test:integration
```

### All Tests

```bash
npm run test:run
```

## Integration Tests

Integration tests are gated behind the `INTEGRATION_TESTS=true` environment variable and require:

1. **Test Dataset**: Set `NEXT_PUBLIC_SANITY_DATASET=test`
2. **Running Server**: Local development server on port 3000
3. **Environment Flag**: `INTEGRATION_TESTS=true`

### Setup for Integration Tests

1. Create a test dataset in Sanity
2. Set environment variables:
   ```bash
   export INTEGRATION_TESTS=true
   export NEXT_PUBLIC_SANITY_DATASET=test
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run integration tests:
   ```bash
   npm run test:integration
   ```

## Test Patterns

### Unit Tests

- Mock all external dependencies
- Test business logic in isolation
- Fast execution (< 100ms per test)
- No external network calls

### Integration Tests

- Hit real API endpoints
- Test full request/response cycle
- Validate rate limiting and headers
- Performance testing
- Real Sanity dataset interaction

## Best Practices

1. **Use Shared Mocks**: Don't duplicate mocks across test files
2. **Use Test Helpers**: Leverage `createTestRequest` and assertion helpers
3. **Test Headers**: Always validate rate limiting and security headers
4. **Mock Sessions**: Use session helpers for authentication testing
5. **Clean State**: Tests should be independent and not affect each other

## CI/CD Integration

### Unit Tests (Every PR)

```yaml
- name: Run Unit Tests
  run: npm run test:unit
```

### Integration Tests (Daily/Scheduled)

```yaml
- name: Run Integration Tests
  env:
    INTEGRATION_TESTS: true
    NEXT_PUBLIC_SANITY_DATASET: test
  run: npm run test:integration
```

## Troubleshooting

### Common Issues

1. **Mock Not Working**: Ensure mocks are in `setup.ts` and imported correctly
2. **Type Errors**: Check that test helpers are properly typed
3. **Integration Test Failures**: Verify dataset and server are running
4. **Rate Limit Issues**: Check that rate limiting mocks are working

### Debug Mode

Run tests with verbose output:

```bash
npm run test:unit -- --reporter=verbose
```

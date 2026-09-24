# Quantum Full-Stack / Frontend homework (TypeScript, REST API)

## Requirements

- [Node.js 16.14.2](https://nodejs.org) or later
- [Yarn 1.22.17](https://classic.yarnpkg.com) or later

## Configuration

Copy file `.env.example` to `.env`

```bash
cp .env.example .env
```

| Key                      | Description                       | Required | Type     |
| ------------------------ | --------------------------------- | -------- | -------- |
| `APP_NAME`               | App Name                          | **✓**    | `string` |
| `APP_VERSION`            | App Version                       |          | `string` |
| `APP_BUILD_SIGNATURE`    | App Build Signature               |          | `string` |
|                          |                                   |          |          |
| `API_BASE_URL`           | API Base URL                      | **✓**    | `string` |
|                          |                                   |          |          |
| `MOCK_API_BASE_URL`      | Mock API Base URL                 |          | `string` |
| `MOCK_API_CLIENT_ID`     | Mock API Credential Client ID     |          | `string` |
| `MOCK_API_CLIENT_SECRET` | Mock API Credential Client Secret |          | `string` |

## Installation

```bash
pnpm install
```

## Usage

- Start Application
  ```bash
  pnpm dev
  ```
- Build Application
  ```bash
  pnpm build
  ```
- Check `package.json` to see more script.

## Requirements Checklist

- [✅] Staff should be able to login
- [✅] Staff should be able to logout
- [✅] Staff should be able to see another staff
- [✅] Staff should be able to update the staff data
- [✅] Staff should not be able to update another staff data
- [✅] Staff should be able to clock in
- [✅] Staff should be able to clock out

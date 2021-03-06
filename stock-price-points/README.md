# Project Name

> Hackin Robinhood by Robin Hackers

## Related Projects

  - https://github.com/RobinHackers/stock_fluctuation
  - https://github.com/RobinHackers/stock-price-points
  - https://github.com/RobinHackers/side-nav-bar
  - https://github.com/RobinHackers/people-also-bought

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

Refer to engineeringJournal.md for additional notes during development.

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

### CRUD API

  - GET all companies: "/api/stockPricePoints/"
  - GET one company: "/api/stockPricePoints/:company"
  - DELETE one company: "/api/stockPricePoints/:company"
  - POST one company: "/api/stockPricePoints/"
  - PUT one company: "/api/stockPricePoints/:company"

### PostgreSQL
  - To generate and load database:
    npm run gen-data
    npm run load-db

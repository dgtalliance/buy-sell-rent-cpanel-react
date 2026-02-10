# Cpanel Form Builder

**(Buy / Sell / Rent Forms)**

This project contains the Form Builder used in the Cpanel for **Buy, Sell, and Rent** flows.

---

## Requirements

- Node.js (LTS recommended)
- Yarn

---

## Installation

Install dependencies:

```bash
yarn
```

---

## Development

Run the project in development mode:

```bash
yarn dev
```

This command starts the local development server with hot reload enabled.

---

## Build

Generate the production build:

```bash
yarn build
```

The build output will be generated in the `./dist` directory.

---

## Deployment

### Repository Information

- **Repository:** [`idxboost-cpanel`](https://github.com/dgtalliance/idxboost-cpanel/tree/dev)
- **Branch:** `dev`
- **Target Path:**

  ```
  src/CpanelBundle/Resources/public/idx-forms/
  ```

### Deployment Steps

1. Run the production build:

   ```bash
   yarn build
   ```

2. Go to the `./dist` folder.

3. Rename the generated files:

   - Rename the main `.css` file to:

     ```
     index.css
     ```

   - Rename the main `.js` file to:

     ```
     index.js
     ```

4. Copy both files (`index.css` and `index.js`) into the following path:

   ```
   src/CpanelBundle/Resources/public/idx-forms/
   ```

5. Verify the changes in the Cpanel after deployment.

---

## Notes

- Make sure old cached assets are cleared if changes are not reflected.
- Always deploy from the **dev** branch.

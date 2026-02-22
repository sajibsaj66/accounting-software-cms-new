# Quotation Module (Portable)

?? folder ?? copy ??? ???? React project-? ????? ??????? ???? ??????

## Files
- `QuotationEntryStandalone.js`
- `index.js`

## Required Packages
- react
- axios
- sweetalert
- comma-number
- @material-ui/core
- @material-ui/icons
- @material-ui/lab
- @material-ui/pickers
- @date-io/date-fns

## Usage
```jsx
import QuotationEntryStandalone from './quotation-module';

<QuotationEntryStandalone
  apiBaseUrl="https://your-api-base-url"
  authToken={token}
  quotationId={null}
  onNavigate={(path) => history.push(path)}
  onSaved={(payload) => console.log(payload)}
/>
```

## Props
- `apiBaseUrl` (required): API base URL
- `authToken` (required): auth token
- `quotationId` (optional): ???? edit mode-? existing quotation load ???
- `onNavigate` (optional): route navigate callback
- `onSaved` (optional): save success callback

## API Endpoints Used
- GET `/api/get-quotation-invoice`
- POST `/api/get-employees`
- POST `/api/get-customers`
- POST `/api/get-individual-products`
- POST `/api/get-products`
- POST `/api/get-product-current-stock`
- POST `/api/get-checkbox-values`
- POST `/api/get-units`
- POST `/api/get-quotation-with-details`
- POST `/api/save-quotation`
- POST `/api/update-quotation`

## Notes
- ?? component project-specific redux/config dependency ???? ?????
- ??? CSS style ????? ??, ????? project ??????? class/style tune ??? ???? ?????

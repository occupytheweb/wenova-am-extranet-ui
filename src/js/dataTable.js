import DataTable from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import DateTime from 'datatables.net-datetime';
import 'datatables.net-searchbuilder-bs5';
import 'datatables.net-searchpanes-bs5';


export const buildDataTable = (selector, opts) => new DataTable(
  selector, {
    responsive: true,
    ...opts
  })
;


import $ from 'jquery';

import {fetchPayments } from "./api-client";
import {authenticationGuard} from "./auth";
import {updateLayoutUi} from "./layout";
import {buildDataTable} from "./dataTable";
import {DateTime} from "luxon";


$(
  () => {
    updateLayoutUi('payments')

    authenticationGuard()
      .then(
        sink => {
          fetchPayments()
            .then(
              (payments) => {
                buildDataTable(
                  "#payments-table", {
                    responsive: true,
                    data: payments.data,
                    columns: [
                      { data: 'note_id' },
                      { data: 'note_date',
                        render: (data, type) => {
                          if (type === 'display') {
                            return DateTime.fromISO(data).toFormat('dd MMM yyyy');
                          }

                          return data;
                        }
                      },
                      { data: 'periode' },
                      { data: 'total' },
                      { data: 'note_date',
                        render: (data, type) => {
                          if (type === 'display') {
                            return DateTime.fromISO(data).toFormat('dd MMM yyyy');
                          }

                          return data;
                        }
                      },
                      {
                        data: 'urlPdf' ,
                        render: (data, type) => {
                          if (type === 'display') {
                            return `<a href="${data}" title="${data}">Ouvrir</a>`;
                          }

                          return data;
                        }
                      }
                    ],
                  }
                )
              }
            )
          ;

          return sink;
        }
      )

  }
);


$("#years-selector").change(
  () => {
    const year = $("#years-selector").val();
    const searchElement = $("#payments-table_filter input[type=search]");

    if (!!year) {
      searchElement.val(year);
      searchElement.trigger("keyup");
    }
  }
)

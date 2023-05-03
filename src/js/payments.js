import $ from 'jquery';

import {fetchPayments } from "./api-client";
import {authenticationGuard} from "./auth";
import {updateLayoutUi} from "./layout";
import {buildDataTable, patchDataTable} from "./dataTable";
import {DateTime} from "luxon";
import {toEuroFormat, toShortEuroFormat} from "./formatting.js";


const updateTotal = (payments) => {
  const total = (payments || [])
    .map(payment => payment.total)
    .reduce(
      (accumulator, amount) => accumulator + +amount
      ,
      0
    )
  ;

  $("#payments-total").text(toShortEuroFormat(total));
};


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
                      { data: 'total',
                        render: (data, type) => {
                          if (type === 'display' && !!data) {
                            return toLongEuroFormat(data);
                          }

                          return data;
                        }
                      },
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
                            return `
                              <a href="${data}" title="${data}" class="link-info" target="_blank">
                                <span>Ouvrir&nbsp;</span>
                                <i class="fas fa-arrow-up-right-from-square"></i>
                              </a>
                            `;
                          }

                          return data;
                        }
                      }
                    ],
                    order: [
                      [1, "desc"],
                      [3, "desc"],
                    ],
                  }
                );

                patchDataTable();
                updateTotal(payments.data);
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

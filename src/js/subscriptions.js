import $ from 'jquery';

import {fetchSubscriptions} from "./api-client.js";
import {authenticationGuard} from "./auth.js";
import {updateLayoutUi} from "./layout.js";
import {buildDataTable} from "./dataTable.js";
import {DateTime} from "luxon";


$(
  () => {
    updateLayoutUi('subscribers')

    authenticationGuard()
      .then(
        sink => {
          fetchSubscriptions()
            .then(
              (subscriptions) => {
                buildDataTable(
                  "#subscriptions-table", {
                    responsive: true,
                    data: subscriptions.data,
                    columns: [
                      { data: 'Investisseur' },
                      { data: 'Produit' },
                      { data: 'Montant' },
                      { data: 'Date BS',
                        render: (data, type) => {
                          if (type === 'display') {
                            return DateTime.fromISO(data).toFormat('dd MMM yyyy');
                          }

                          return data;
                        }
                      },
                      { data: 'Num ODDO' },
                      {
                        data: 'Attestation_ODDO' ,
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


$("#fund-selector").change(
  () => {
    const fund = $("#fund-selector").val();
    const searchElement = $("#subscriptions-table_filter input[type=search]");

    if (!!fund) {
      searchElement.val(fund);
      searchElement.trigger("keyup");
    }
  }
)

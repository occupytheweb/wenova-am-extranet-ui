import $ from 'jquery';

import {fetchSubscriptions} from "./api-client.js";
import {authenticationGuard} from "./auth.js";
import {updateLayoutUi} from "./layout.js";
import {buildDataTable, patchDataTable} from "./dataTable.js";
import {DateTime} from "luxon";


const updateTotal = (subscriptions) => {
  const total = (subscriptions || [])
    .map(subscription => subscription.Montant)
 /*   .filter(amountText => !!amountText)
    .map(
      amountText => amountText
        .replace(/,/g, "")
        .replace(/€/g, "")
    )
    .map(amountText => +amountText)
    .filter(amount => Number.isFinite(amount)) */
    .reduce(
      (accumulator, amount) => accumulator + +amount
      ,
      0
    )
  ;

  $("#subscriptions-total").text(`${Number.parseInt(total).toLocaleString('fr-FR')} €`);
};


$(
  () => {
    updateLayoutUi('subscribers');

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
                      { data: 'Date_effet',
                        render: (data, type) => {
                          if (type === 'display') {
                            return DateTime.fromISO(data).toFormat('dd MMM yyyy');
                          }

                          return data;
                        }
                      },
                      { data: 'Num_ODDO' },
                      {
                        data: 'Attestation_ODDO' ,
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
                      [3, "desc"],
                      [2, "desc"],
                      [0, "asc" ],
                    ],
                  }
                );

                patchDataTable();
                updateTotal(subscriptions.data);
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

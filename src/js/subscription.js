// subscription list

function getSubscriptionList() {
  fetch("http://localhost:4000/subscription")
    .then((res) => res.json())
    .then(({ data }) => {
      const text = data?.map(
        (item) => `
            <tr>
              <td>${item.Investisseur}</td>
              <td>${item.Produit}</td>
              <td>${item.Montant} €</td>
              <td>${item.Date}</td>
              <td>${item.Num_ODDO}</td>
              <td><a href="#">${item.attestation}</a></td>
           </tr>`
      );
      $("#subscriptions").html(text);
    });
}

getSubscriptionList();

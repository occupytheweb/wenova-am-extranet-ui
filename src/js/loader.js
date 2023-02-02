import $ from 'jquery';


$(
  () => {
    setTimeout(
      () => {
        $("#loader").addClass("invisible");

        setTimeout(
          () => $("#loader img").addClass("d-none"),
          200
        );
      },
      750
    )
  }
);

import $ from 'jquery';


const loader     = () => $("#loader");
const loaderLogo = () => $("#loader img");


export const showLoader = () => {
  loader().first().removeClass("invisible");
  setTimeout(
    () => loaderLogo().first().removeClass("d-none"),
    200
  );
}


export const hideLoader = () => {
  loader().addClass("invisible");
  setTimeout(
    () => loaderLogo().addClass("d-none"),
    200
  );
}


$(
  () => {
    setTimeout(
      () => {
        hideLoader();
      },
      750
    )
  }
);

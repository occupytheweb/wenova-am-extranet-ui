const iconClass = {
  "show": "fa fa-eye",
  "hide": "fa fa-eye-slash",
};
const inputType = {
  "show": "text",
  "hide": "password",
};


document.querySelectorAll(".password-with-visibility .toggle")
  .forEach(
    passwordVisibilityToggle => {
      passwordVisibilityToggle.addEventListener(
        "click",
        (event) => {
          const toggle = event.currentTarget;
          const input  = toggle.closest(".password-with-visibility").querySelector("input");
          const icon   = toggle.querySelector("i");

          const currentClass = icon.className;
          const operationKey = /slash/.test(currentClass)
            ? "show"
            : "hide"
          ;

          const targetClass = iconClass[operationKey];
          const targetType  = inputType[operationKey];

          icon.className = targetClass;
          input.type = targetType;
        },
        false
      )
    }
  )
;

import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnFrPackage from '@zxcvbn-ts/language-fr'


const options = {
  translations: zxcvbnFrPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFrPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)


const evaluatePasswordStrength = (
  password,
  userInputs = []
) => zxcvbn(password, userInputs);


export const criteriaStatus = (password) => {
  const containerIdToCriteriaMap = [
    {
      id: 'criteria-lowercase',
      criteria: (password) => /[a-z]/.test(password)
    },
    {
      id: 'criteria-uppercase',
      criteria: (password) => /[A-Z]/.test(password)
    },
    {
      id: 'criteria-numbers',
      criteria: (password) => /\d/.test(password)
    },
    {
      id: 'criteria-special-chars',
      criteria: (password) => /[!"£$%^&*(){}\[\]_+|@~;'.,?]/.test(password)
    },
    {
      id: 'criteria-length',
      criteria: (password) => password.length >= 6
    },
  ];

  return containerIdToCriteriaMap.reduce(
    (accumulator, entry) => [
      ...accumulator,
      {
        id: entry.id,
        satisfied: entry.criteria(password)
      }
    ],
    []
  );
}


export const passwordPassesAllCriteria = (password) => criteriaStatus(password)
  .map(criteria => criteria.satisfied)
  .reduce(
    (accumulator, criteria) => accumulator && criteria
  )
;


export const updatePasswordCriteria = (
  password
) => {
  for (const entry of criteriaStatus(password)) {
    const checkIconClass = "fa fa-check fa-fw";
    const crossIconClass = "fa fa-times fa-fw";

    const icon = document.querySelector(`#${entry.id} i`);

    icon.className = entry.satisfied
      ? checkIconClass
      : crossIconClass
    ;
  }
}


export const updatePasswordStrengthMeter = (
  password,
  strengthMeter,
) => {
  const status                    = criteriaStatus(password);
  const numberOfCriteria          = status.length;
  const numberOfSatisfiedCriteria = status
    .filter(entry => !!entry.satisfied)
    .length
  ;
  const percentageScore = (numberOfSatisfiedCriteria / numberOfCriteria) * 100;

  strengthMeter.style.width = `${percentageScore}%`;
  strengthMeter.className = percentageScore === 100
    ? "progress-bar bg-success"
    : "progress-bar"
  ;
};


export const updatePasswordFeedback = (
  password,
  feedbackContainer,
  warningContainer,
  suggestionContainer
) => {
  const evaluation = evaluatePasswordStrength(password);

  const { feedback    } = evaluation;
  const { warning     } = feedback;
  const { suggestions } = feedback;

  if (!!warning) {
    feedbackContainer.className = "visible";

    warningContainer.innerHTML = `
      <div>
        <i class="fa fa-warning fa-fw text-warning"></i>
        <span id="password-warning-text">${warning}</span>
      </div>
    `;
    suggestionContainer.innerHTML = suggestions
      .map(
        suggestion => `
          <div>
            <i class="fa fa-info fa-fw text-info"></i>
            <span id="password-recommendation-text">${suggestion}</span>
          </div>
        `
      )
      .join("\n")
    ;

  } else {
    feedbackContainer.className = "invisible";
  }
};

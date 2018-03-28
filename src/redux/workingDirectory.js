const SET_WORKING_DIRECTORY = 'SET_WORKING_DIRECTORY'

export function setWorkingDirectory (data) {
  return {
    type: SET_WORKING_DIRECTORY,
    data
  }
}

export default function (state = '', action) {
  switch (action.type) {
    case SET_WORKING_DIRECTORY:
      return action.data
  }
  return state
}

const KEY = "studentnest.campus"
const OBJECT_ID = /^[a-f\d]{24}$/i

export const validCampusId = (v: string | null | undefined) => (v && OBJECT_ID.test(v) ? v : undefined)

export const getSavedCampus = () => {
  try {
    return validCampusId(localStorage.getItem(KEY))
  } catch {
    return undefined
  }
}

export const saveCampus = (id: string) => {
  try {
    localStorage.setItem(KEY, id)
  } catch {
  }
}
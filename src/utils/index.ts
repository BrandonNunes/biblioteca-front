export const formateDate = (date: string): string => {
    let newDate = date.split("T")
    let final = newDate[0].split("-")
    return `${final[2]}/${final[1]}/${final[0]}`
}

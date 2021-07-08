

export const updateFormValue = (setter: (v: any)=>any) => {
    return (e: React.FormEvent<any>) => {
        e.preventDefault()
        let val: string | number = e.currentTarget.value
        if (typeof(val) === 'string' && parseInt(val)!==NaN) val = parseInt(val) 
        setter(e.currentTarget.value)
    }
}

export const updateMultiSelect = (setter: (v: any)=>any, selectList: any[]) => {
    return (e: React.FormEvent<any>) => {
        console.log("select before: ", selectList)
        e.preventDefault()
        e.stopPropagation()
        let val: string | number = e.currentTarget.value
        if (typeof(val) === 'string' && parseInt(val)!==NaN) val = parseInt(val) 
        const valIndex = selectList.indexOf(val)
        if (valIndex !== -1) {
            selectList.splice(valIndex)
            setter(selectList)
        }
        else {
            setter([...selectList, e.currentTarget.value])
        }
        console.log("select after: ", selectList)
    }
}

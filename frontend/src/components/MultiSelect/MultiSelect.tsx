import React, { FC, useEffect, useState } from "react";
import './MultiSelect.scss'

interface Option {
    value: string | number;
    label: string
}

const MultiOpt: FC<{index: number, opt: Option; callBack: (v: any)=>any}> = ({
    index, opt, callBack
}) => {
    const [pressed, setPressed] = useState(false)
    const onClickFunc = async (e: React.FormEvent<any>) => {
        // e.preventDefault()
        await callBack(opt)
        setPressed(!pressed)
    }
    return (
        <div 
            onClick={onClickFunc} 
            className="BDMultiOpt"
            id={pressed ? 'pressed' : 'unpressed'}
            style={ {gridRow: 1} }
        >
            {opt.label}
        </div>
    )
}
export const MultiSelect: FC<{
    opts: Option[]; 
    setter: (v: any)=>any
    nullify?: boolean
    nullifiers?: ((v: any)=>any)[]
}> = ({
    opts, setter, nullify = false, nullifiers = undefined
}) => {
    const [selectedOpts, setSelectedOpts] = useState<Option[]>([])
    
    const optCallback = async (val: Option) => {

        const valIndex = selectedOpts.map(v=>v.value).indexOf(val.value)
        if (valIndex !== -1) {
            // remove if its in there
            selectedOpts.splice(valIndex, 1)
            setSelectedOpts([...selectedOpts])
            if(nullify && nullifiers && typeof(val.value)==='number') nullifiers[val.value](null)
        } else {
            // append if its not
            setSelectedOpts([...selectedOpts, val])
        }

        // setter(selectedOpts.map(opt=>opt.value))
    }

    useEffect(()=>setter(selectedOpts.map(opt=>opt.value)), [selectedOpts])
    return (
        <div 
            className='BDMultiSelect'
            style={{gridTemplateColumns: '1fr '.repeat(opts.length)}}
        >
            {opts.map((opt, i)=>
                <MultiOpt 
                    key={i} 
                    index={i}
                    opt={opt}
                    callBack={optCallback}
                />
            )}
        </div>
    )
}
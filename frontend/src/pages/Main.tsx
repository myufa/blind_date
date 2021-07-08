import React, { FC, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { MainNav } from "../components/MainNav";
import './Main.scss'

const millPicUrl = 'https://www.svgrepo.com/show/100551/mill.svg'

export const Main: FC<{authenticated: boolean}> = (props) => {
    return (
        <Redirect exact push to='/login/' />
    )
}
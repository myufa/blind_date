import React, { FC, useEffect, useRef, useState } from "react";
import { userClient } from "../../services";
import { Method } from "axios";
import './TestClient.scss'

import { TestButton } from '../../components/TestButton'

const testRoutes = [
    { name: 'getHello', callback: userClient.getHello }
]

export const TestClient:FC = () => {
    return (
        <div>
            {testRoutes.map((route, i) => <TestButton name={route.name} callback={route.callback} key={i} />)}
        </div>
    )
}
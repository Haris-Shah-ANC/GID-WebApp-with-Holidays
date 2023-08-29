import React from 'react';
import * as Actions from '../../../state/Actions';
import { Link, useNavigate } from 'react-router-dom';





const Overview = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    return (
        <React.Fragment>

            <div className="flex h-full w-full bg-red-300">
            <text>hii</text>
            </div>
        </React.Fragment>

    )
}

export default Overview;

const socials = [
    { icon: "google", button: { href: "#pablo" } },
    { icon: "facebook", button: { href: "#pablo" } },
]
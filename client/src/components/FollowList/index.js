import React from 'react';
import { Link } from 'react-router-dom';

function FollowList({ following }) {

    return(
        <div className="mr-4">
            {following.map(follow => (
                <Link key={follow._id} to={`/profile/${follow.username}`}>
                    <button className="btn w-100 display-block my-1" >{follow.username}</button>
                </Link>
            ))}
        </div>
    )
}

export default FollowList;
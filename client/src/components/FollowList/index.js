import React from 'react';
import { Link } from 'react-router-dom';

function FollowList({ username, following }) {
    if (!following.length){
        return <p className="p-3">{username} Is not following anyone!</p>
    }

    return(
        <div>
            <h5>
                {username}'s Following List
            </h5>
            {following.map(follow => (
                <Link key={follow._id} to={`/profile/${follow.username}`}>
                    <button className="btn w-100 display-block my-1" >{follow.username}</button>
                </Link>
            ))}
        </div>
    )
}

export default FollowList;
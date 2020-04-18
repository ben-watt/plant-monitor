import React from 'react';

const Page = (props) => {
    return (
        <div className="page">
            {props.children}
        </div>
    );
}

export default Page;
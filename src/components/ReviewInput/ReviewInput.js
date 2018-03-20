import React from 'react';
import './ReviewInput.css';

export default function ReviewInput ({ submit, handleChange, user }) {
    let reviewer_id = user.id;
    return (
        <div className='review-input'>
            <textarea onChange={(e) => handleChange(e.target.value)}></textarea>
            <button onClick={() => submit({ reviewer_id })}>Submit Review</button>
        </div>
    )
}
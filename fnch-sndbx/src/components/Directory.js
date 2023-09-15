import React, { useState, useEffect, useCallback } from 'react'
import Individual from './Individual';


export default function Directory({ directory, handleError }) {
    return (
        <div >
            { directory.individuals.map((i) => <Individual key={i.id} individual={i} handleError={handleError}/>)}
        </div>
    );
}


/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ConstraintSide from './ConstraintSide';

export default function Constraint({ constraint }) {

  let rightSide;
  if (constraint.rightSide) {
    rightSide = (<ConstraintSide constraintSide={constraint.rightSide} />);
  }

  return (
    <span className="constraint">
      <span className="constraint-name">{constraint.name}</span>
      {'('}
      <ConstraintSide constraintSide={constraint.leftSide} />
      {constraint.rightSide && ', '}
      {rightSide}
      {')'}
    </span>
  );
}

Constraint.propTypes = {
  constraint: PropTypes.object.isRequired,
};

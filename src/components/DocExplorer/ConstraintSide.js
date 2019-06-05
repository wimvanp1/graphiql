/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Constraint from './Constraint';

export default function ConstraintSide({ constraintSide }) {

  let side = constraintSide;
  if (side && typeof side !== "string") {
    side = (<Constraint constraint={constraintSide} />);
  }

  return (
    <span className="constraint-side">
      {side}
    </span>
  );
}

ConstraintSide.propTypes = {
  constraintSide: PropTypes.object.isRequired,
};

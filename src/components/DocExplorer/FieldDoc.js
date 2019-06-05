/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Argument from './Argument';
import Constraint from './Constraint';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';

export default class FieldDoc extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    onClickType: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field;
  }

  render() {
    const field = this.props.field;

    let argsDef;
    if (field.args && field.args.length > 0) {
      argsDef = (
        <div className="doc-category">
          <div className="doc-category-title">
            {'arguments'}
          </div>
          {field.args.map(arg =>
            <div key={arg.name} className="doc-category-item">
              <div>
                <Argument arg={arg} onClickType={this.props.onClickType} />
              </div>
              <MarkdownContent
                className="doc-value-description"
                markdown={arg.description}
              />
            </div>,
          )}
        </div>
      );
    }

    let constraintsDef;
    if (field.constraints && field.constraints.length > 0) {
      constraintsDef = (
        <div className="doc-category">
          <div className="doc-category-title">
            {'constraints'}
          </div>
          {field.constraints.map(constraint =>
            <div key={constraint.name} className="doc-category-item">
              <div>
                <Constraint constraint={constraint} />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <MarkdownContent
          className="doc-type-description"
          markdown={field.description || 'No Description'}
        />
        {field.deprecationReason &&
          <MarkdownContent
            className="doc-deprecation"
            markdown={field.deprecationReason}
          />}
        <div className="doc-category">
          <div className="doc-category-title">
            {'type'}
          </div>
          <TypeLink type={field.type} onClick={this.props.onClickType} />
        </div>
        {argsDef}
        {constraintsDef}
      </div>
    );
  }
}

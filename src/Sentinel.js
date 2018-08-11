import React from 'react';
import throttle from 'lodash/throttle';

export class Sentinel extends React.Component<SentinelProps, {}> {
  static defaultProps = {
    threshold: 200,
    throttle: 64,
  };

  sentinel = React.createRef();

  componentDidMount() {
    this.checkViewThreshold(); // sentinel could be in view on mount
    window.addEventListener('scroll', this.checkViewThreshold);
    window.removeEventListener('resize', this.checkViewThreshold);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkViewThreshold);
    window.removeEventListener('resize', this.checkViewThreshold);
  }

  checkViewThreshold = throttle(() => {
    if (!this.sentinel || !this.sentinel.current) {
      return;
    }

    const { threshold, onView } = this.props;
    const sentinelTop = this.sentinel.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sentinelTop - windowHeight < threshold) {
      onView();
    }
  }, this.props.throttle);

  render() {
    return <div ref={this.sentinel} />;
  }
}

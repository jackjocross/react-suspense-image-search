import React, { Component } from 'react';
import { unstable_deferredUpdates } from 'react-dom';
import { Route, withRouter } from 'router-suspense';
import posed from 'react-pose';
import { Form, Input, Loader } from 'semantic-ui-react';
import { Img } from './Img';
import { Sentinel } from './Sentinel';

const Pop = posed.div({
  start: {
    opacity: 0,
    scale: 0.5,
  },
  end: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 400 },
    delay: ({ wait = 0 }) => wait,
  },
});

const arrayOf = length => new Array(length).fill(1);
const GROUP_SIZE = 5;

class App extends Component {
  state = {
    searchInput: '',
    groups: 1,
    sentinelViewed: false,
    blocks: [],
    nextBlock: '1',
  };

  handleSearchChange = ({ target: { value: searchInput } }) =>
    this.setState({ searchInput });

  handleSubmit = event => {
    event.preventDefault();
    const { history } = this.props;
    const { searchInput } = this.state;

    history.push(searchInput);
    this.setState({ groups: 1, searchValue: searchInput });
  };

  handleSentinelView = (groupIndex, groups) => () => {
    this.setState({ sentinelViewed: true }, () => {
      unstable_deferredUpdates(() => {
        this.setState(({ groups }) => ({
          groups: groups + 1,
          sentinelViewed: false,
        }));
      });
    });
  };

  render() {
    const { searchInput, searchValue, groups, sentinelViewed } = this.state;

    return (
      <div style={{ margin: 20 }}>
        <Route
          path="/:search"
          children={({ history, match }) => {
            const searchParam =
              match && match.params ? match.params.search : '';

            return (
              <React.Fragment>
                <Form onSubmit={this.handleSubmit} style={{ marginBottom: 20 }}>
                  <Form.Field>
                    <label>Search</label>
                    <Input
                      type="text"
                      placeholder="Press enter to search"
                      value={searchInput}
                      onChange={this.handleSearchChange}
                      loading={searchValue && searchValue !== searchParam}
                    />
                  </Form.Field>
                </Form>
                {arrayOf(groups).map((value, groupIndex) => (
                  <React.Placeholder
                    key={groupIndex}
                    delayMs={1000}
                    fallback={
                      <h5 style={{ textAlign: 'center' }}>Still Loading...</h5>
                    }
                  >
                    {arrayOf(GROUP_SIZE).map((value, imgIndex) => (
                      <Pop
                        key={`${searchParam}-${groupIndex}-${imgIndex}`}
                        initialPose="start"
                        pose="end"
                        wait={imgIndex * 100}
                      >
                        <Img
                          src={`https://source.unsplash.com/1600x900/?${searchParam}&key=${groupIndex}-${imgIndex}`}
                          alt={searchParam}
                          width="100%"
                        />
                      </Pop>
                    ))}
                    {groupIndex === groups - 1 &&
                      !sentinelViewed && (
                        <Sentinel
                          onView={this.handleSentinelView(groupIndex, groups)}
                        />
                      )}
                  </React.Placeholder>
                ))}
                <Loader
                  active
                  inline="centered"
                  style={{ marginTop: 20, marginBottom: 20 }}
                />
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  }
}

export default withRouter(App);

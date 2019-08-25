import React, { Component } from 'react';
import { FlatList, ScrollView, Text, View, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { withNavigation } from 'react-navigation';
import { postComment, postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  }
};

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, comment, author, date) =>
    dispatch(postComment(dishId, rating, comment, author, date))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish !== null) {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
        <Card
          featuredTitle={dish.name}
          image={{
            uri: baseUrl + dish.image
          }}
        >
          <Text style={{ margin: 10 }}>
            {dish.description}
          </Text>
          <View style={styles.formRow}>
            <Icon
              raised
              reverse
              name={props.favorite ? 'heart' : 'heart-o'}
              type='font-awesome'
              color='#f50'
              onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
            />
            <Icon
              raised
              reverse
              name='pencil'
              type='font-awesome'
              color='#512DA8'
              onPress={props.onCommentPress}
            />
          </View>
        </Card>
      </Animatable.View>
    )
  } else {
    return (<View></View>)
  }
}

function RenderComments(props) {
  const comments = props.comments;
  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title='Comments' >
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class DishDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      author: '',
      comment: '',
      rating: 3,
      showModal: false
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  resetForm = () => {
    this.setState({
      author: '',
      comment: '',
    });
  }

  handleRating = (rating) => {
    this.setState({ rating: rating })
  }

  handleComment = (dishId) => () => {
    console.log(JSON.stringify(this.state));

    const date = new Date().toISOString();

    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.comment,
      this.state.author,
      date
    );
    this.toggleModal();
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onCommentPress={this.toggleModal}
        />

        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

        <Modal
          style={styles.modal}
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => { this.resetForm() }}
          onRequestClose={() => { this.resetForm() }}
        >
          <View style={styles.formRow}>
            <Rating
              type='star'
              ratingCount={5}
              imageSize={60}
              showRating
              fractions={1}
              onFinishRating={this.handleRating}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              placeholder='Author'
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              leftIconContainerStyle={styles.formIcon}
              onChangeText={(value) => this.setState({ author: value })}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              placeholder='Comment'
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              leftIconContainerStyle={styles.formIcon}
              onChangeText={(value) => this.setState({ comment: value })}
            />
          </View>
          <View style={styles.formRow}>
            <Button
              title='Submit'
              onPress={this.handleComment(dishId)}
              containerStyle={styles.formButton}
              buttonStyle={{ backgroundColor: '#4B36A2' }}
            />
          </View>
          <View style={styles.formRow}>
            <Button
              title='Cancel'
              onPress={this.toggleModal}
              containerStyle={styles.formButton}
              buttonStyle={{ backgroundColor: '#808081' }}
            />
          </View>
        </Modal>

      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 30
  },
  formIcon: {
    marginRight: 15
  },
  formButton: {
    flex: 1,
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(DishDetail));
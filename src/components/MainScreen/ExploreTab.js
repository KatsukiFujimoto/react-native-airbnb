import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../actions/nav';
import { getRooms } from '../../actions/room';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    padding: 20,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width * 4 / 7,
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  filter: {
    padding: 13,
    backgroundColor: '#007b7f',
  },
  filterButton: {
    backgroundColor: '#2f868e',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 3,
    alignItems: 'center',
  },
  filterText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
});

class ExploreTab extends React.Component {

  componentWillMount() {
    this.props.getRooms();
  }

  onPress(item) {
    this.props.navigate({ routeName: "Room", params: { item: item } });
  }

  onFilterPress() {
    this.props.navigate({ routeName: 'Filter' });
  }

  render() {
    const { rooms, filter } = this.props;
    return (
      <View style={styles.container}>

        <View style={styles.filter}>
          <TouchableOpacity style={styles.filterButton} onPress={ () => this.onFilterPress() }>
            <Icon size={30} name='ios-search' color='white' />
            <Text style={styles.filterText}>
              {`${filter.address || 'Anywhere'} - ${filter.startDate && filter.endDate ? `${filter.startDate} to ${filter.endDate}` : 'Anytime' }`}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          data={rooms}
          renderItem={({item}) =>
            <TouchableOpacity onPress={() => this.onPress(item)} style={styles.item}>
              <Image style={styles.image} source={{uri : item.image}} />
              <Text style={styles.title}>{`$${item.price} ${item.instant ? '🎉' : ''}${item.title}`}</Text>
              <Text>{`${item.homeType} - ${item.bedRoom} bedrooms(s)`}</Text>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => item.id.toString()}
        />

      </View>

    );
  }
}

const mapStateToProps = state => ({
  rooms: state.room.rooms,
  filter: state.room.filter,
});

const mapDispatchToProps = dispatch => ({
  navigate: (route) => dispatch(navigate(route)),
  getRooms: () => dispatch(getRooms()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreTab);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, InputGroup, Spinner, Input, CustomInput } from 'reactstrap';
import ReactPaginate from 'react-paginate';

import { getMaps, getMapsByTitle } from '../api';
import MapCard from './MapCard';
import * as actions from '../actions';


const MAPS_LIMIT = 3;

class MapSelector extends Component {

    state = {
        mapsOffset: 0,
        totalMapsCount: 0,
        loading: false,
        searchingMode: false,
        serchingText: null,
        maps: [],
        selectedMapId: this.props.selectedMapId,
        showOnlyUserMaps: true
    };

    componentWillMount() {
        this.getMapsFromApi();
    };

    componentDidUpdate(prevProps) {
        //whenever the user selects another map
        if (prevProps.selectedMapId !== this.props.selectedMapId) {
            this.setState({ selectedMapId: this.props.selectedMapId });
            var selectedMap = this.state.maps.find(map => map.id === this.props.selectedMapId);
            if (selectedMap)
                this.props.setMapData(selectedMap);
        }
    };

    getMapsFromApi() {
        this.setState({ loading: true });
        getMaps(this.state.mapsOffset, MAPS_LIMIT, this.state.showOnlyUserMaps).then(
            response => {
                this.setState({
                    loading: false,
                    maps: response.data.results,
                    totalMapsCount: response.data.count
                });
            });
    };

    getMapsByTitleFromApi(title) {
        this.setState({ loading: true });
        getMapsByTitle(this.state.mapsOffset, MAPS_LIMIT, title, this.state.showOnlyUserMaps).then(
            response => {
                this.setState({
                    loading: false,
                    maps: response.data.results,
                    totalMapsCount: response.data.count
                });
            });
    };

    handlePageClick = data => {
        let offset = Math.ceil(data.selected * MAPS_LIMIT);
        this.setState({ mapsOffset: offset }, () => {
            if (this.state.searchingMode)
                this.getMapsByTitleFromApi(this.state.searchingText);
            else
                this.getMapsFromApi();
        });
    };

    searchByTitle = event => {
        const titleText = event.target.value;
        if (titleText !== "") {
            this.setState({
                searchingMode: true,
                searchingText: titleText
            }, () => {
                this.getMapsByTitleFromApi(titleText)
            });
        } else {
            this.setState({ searchingMode: false }, () => {
                this.getMapsFromApi()
            });
        }
    };

    mapsOwnerRadioChange = () => {
        this.setState((prevState) => ({ showOnlyUserMaps: !prevState.showOnlyUserMaps }),
            () => this.getMapsFromApi());
    };

    selectMapHandler = (map) => {
        this.setState({ selectedMapId: map.id });
        this.props.setMapData(map);
    };

    render() {
        let searchIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
        return (
            <Col>
                <InputGroup className="mb-4">
                    <span className="input-group-addon-icon">{searchIcon}</span>
                    <Input onChange={this.searchByTitle} placeholder="Search maps by title" />
                </InputGroup>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CustomInput label="My Maps" checked={this.state.showOnlyUserMaps}
                        onChange={this.mapsOwnerRadioChange} name="radio" type="radio" id="myMapsRadio" className="mr-3" />
                    <CustomInput label="All Maps" checked={!this.state.showOnlyUserMaps}
                        onChange={this.mapsOwnerRadioChange} name="radio" type="radio" id="allMapsRadio" />
                </div>

                {this.state.loading ? <center><Spinner /></center> :
                    this.state.maps.length > 0 ?
                        this.state.maps.map((map) =>
                            <MapCard key={map.id} map={map}
                                onSelectMapHandler={() => this.selectMapHandler(map)}
                                checked={map.id == this.state.selectedMapId} />) :
                        <strong><h3 style={{ textAlign: "center" }}>No Maps Found</h3></strong>}

                <ReactPaginate
                    previousLabel={'previous'}
                    breakLabel={'...'}
                    nextLabel={'next'}
                    pageCount={this.state.totalMapsCount / MAPS_LIMIT}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'} />
            </Col>
        );
    }
};

const mapStateToProps = state => {
    return {
        selectedMapId: state.config.instanceToEdit ? state.config.instanceToEdit.app_map : null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setMapData: (map) => dispatch(actions.setMapData(map)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSelector);
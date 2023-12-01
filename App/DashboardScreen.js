import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, FlatList, TextInput } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Parser } from 'htmlparser2';

const Dashboard = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromLat, setFromLat] = useState(null);
  const [fromLon, setFromLon] = useState(null);
  const [toLat, setToLat] = useState(null);
  const [toLon, setToLon] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [uber, setUber] = useState("");

  async function getRouteInfo(startLat, startLng, endLat, endLng) {
    try {
        // Construct the URL for the OSRM routing service
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

        // Make the API request
        const response = await fetch(osrmUrl);
        const data = await response.json();

        // Check if the response has routes
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

            // Extract distance and duration
            // Distance is in meters, duration is in seconds
            const distance = route.distance; // in meters
            const duration = route.duration; // in seconds

            return {
                distance: distance,
                duration: duration
            };
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        console.error('Error fetching route info:', error);
        return null;
    }
}

function parseRidesData(jsonData) {
  // Checking if 'data' and 'products' exist in the JSON
  if (!jsonData.data || !jsonData.data.products || !jsonData.data.products.tiers) {
      console.log("Invalid JSON structure");
      return;
  }

  const tiers = jsonData.data.products.tiers;
  const rides = [];

  // Looping through each tier
  tiers.forEach(tier => {
      // Checking if products exist in the tier
      if (!tier.products) return;

      // Looping through each product in the tier
      tier.products.forEach(product => {
          // Extracting required information
          const rideType = product.displayName;
          const estimatedTripTime = product.estimatedTripTime;
          const fare = product.fare;

          // Adding to the rides array
          rides.push({
              rideType,
              estimatedTripTime,
              fare
          });
      });
  });

  return rides;
}

  async function getRidePrice(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
    var myHeaders = new Headers();
    myHeaders.append("authority", "m.uber.com");
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("cookie", "marketing_vistor_id=c546454c-59f9-4dc2-ab24-bde1e5f47d3c; segmentCookie=b; utag_main_segment=a; utag_geo_code=US; utag_main_optimizely_segment=a; UBER_CONSENTMGR=1701313539094|consent:true; CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1701313539094%7Cconsent:true; udi-id=xPOviiR0bDIVkOGZi+Ju9wNbAo3c8Ihh4QzqCGw/Flm/GRLPkVXiUHsLEdRg82lHiMeeTERlR0Bjns/iQVpfD61ip524jK38Bf6QsJP0Bg+baM2ghziAef7UdoX6SnohHOLbNWyCKWMUGyQu7gLoJmackE5aghUA0yH5s8I0VSMQPrfIlAD3VDpcB+ClLowW27uozGvZ07hAe+ol79J39Q==uSgEzMFxOkGOAfhRMFAssw==AW6PsWbCW2l+NDqg5ro7stqkcn+m2R8KnDjUqyLLD9s=; sid=QA.CAESEOKcdekFkkAdo3DctptfSE8YkJK-rAYiATEqJDY0MTc4Mzc1LWJlMTAtNDcxOC1hOGYzLTk0OWJmY2JlZTA0NTI8RK5KVk_w9VMRDiv3G5Ih2f8MoChSlV9QKEdu6vC1CD9ojAdc0TddByW0kA_Eg0M-UnZo_-W-dtjzcxsuOgExQgh1YmVyLmNvbQ.XS06ksg-RVAlfQYAkFqnZOU9GGi5etgVnbBdHaevxKY; csid=1.1703905552407.zWpeMUxMrv7Ru92YI9A1CTTMG712TnhMlGLA7QQwHf0=; _cc=AaF0k89JYcVPsp5MsWaElimS; _cid_cc=AaF0k89JYcVPsp5MsWaElimS; udi-fingerprint=9mWRv3awsvECP4XF/GQJWeC39AXZZZmrnf1B7d3o+/AMtFmWSkJ+G6fsNmL5sCwSExIdilUkC8PrBP2AgLEJNQ==s4CMa6ALnTSH2pUKrenf4gqG+qlvh5h6SIxePuN4/GQ=; x-uber-analytics-session-id=79f7b817-2ce9-4051-9019-ff4b967e4050; utag_main__sn=2; utag_main_ses_id=1701333654159%3Bexp-session; utag_main__ss=0%3Bexp-session; _ua={\"session_id\":\"1a06ed7b-a99b-43c0-8cbb-9f9148fb79c6\",\"session_time_ms\":1701333678241}; utag_main__pn=3%3Bexp-session; utag_main__se=8%3Bexp-session; utag_main__st=1701335668616%3Bexp-session; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzM4NjksImV4cCI6MTcwMTQyMDI2OX0.v_FR3x0cfyEz5Hvn-7VDQU0tCuvVRGhVgs2NXeA_Gmw; marketing_vistor_id=c546454c-59f9-4dc2-ab24-bde1e5f47d3c; _ua={\"session_id\":\"1a06ed7b-a99b-43c0-8cbb-9f9148fb79c6\",\"session_time_ms\":1701333678241}");
    myHeaders.append("dnt", "1");
    myHeaders.append("origin", "https://m.uber.com");
    myHeaders.append("referer", "https://m.uber.com/go/product-selection?drop%5B0%5D=%7B%22addressLine1%22%3A%22340%20Fremont%20Apartments%22%2C%22addressLine2%22%3A%22340%20Fremont%20St%2C%20San%20Francisco%2C%20CA%22%2C%22id%22%3A%220300be20-8f73-0a67-1c26-cb68e8f7c46d%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A37.7870293%2C%22longitude%22%3A-122.3929983%2C%22provider%22%3A%22uber_places%22%7D&pickup=%7B%22addressLine1%22%3A%22Santa%20Clara%20Natural%20Organic%20Market%22%2C%22addressLine2%22%3A%22San%20Francisco%2C%20CA%22%2C%22id%22%3A%22e8ce16ce-f414-269b-c01f-4792de2307a8%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A37.771594%2C%22longitude%22%3A-122.435305%2C%22provider%22%3A%22uber_places%22%7D&uclick_id=30d0ed2d-7111-42df-867f-30d99485fe36&vehicle=8");
    myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
    myHeaders.append("x-csrf-token", "x");
    myHeaders.append("x-uber-rv-session-type", "desktop_session");
    myHeaders.append("x-uber-rv-tenancy", "uber/production");

    var raw = JSON.stringify({
      "operationName": "Products",
      "variables": {
        "includeRecommended": false,
        "destinations": [
          {
            "latitude": destinationLatitude,
            "longitude": destinationLongitude
          }
        ],
        "pickup": {
          "latitude": originLatitude,
          "longitude": originLongitude
        }
      },
      "query": "query Products($destinations: [InputCoordinate!]!, $includeRecommended: Boolean = false, $pickup: InputCoordinate!, $pickupFormattedTime: String, $profileType: String, $targetProductType: EnumRVWebCommonTargetProductType) {\n  products(\n    destinations: $destinations\n    includeRecommended: $includeRecommended\n    pickup: $pickup\n    pickupFormattedTime: $pickupFormattedTime\n    profileType: $profileType\n    targetProductType: $targetProductType\n  ) {\n    ...ProductsFragment\n    __typename\n  }\n}\n\nfragment ProductsFragment on RVWebCommonProductsResponse {\n  classificationFilters {\n    ...ClassificationFiltersFragment\n    __typename\n  }\n  defaultVVID\n  productsUnavailableMessage\n  renderRankingInformation\n  tiers {\n    ...TierFragment\n    __typename\n  }\n  __typename\n}\n\nfragment BadgesFragment on RVWebCommonProductBadge {\n  color\n  text\n  __typename\n}\n\nfragment ClassificationFiltersFragment on RVWebCommonClassificationFilters {\n  filters {\n    ...ClassificationFilterFragment\n    __typename\n  }\n  hiddenVVIDs\n  standardProductVVID\n  __typename\n}\n\nfragment ClassificationFilterFragment on RVWebCommonClassificationFilter {\n  currencyCode\n  displayText\n  fareDifference\n  icon\n  vvid\n  __typename\n}\n\nfragment TierFragment on RVWebCommonProductTier {\n  products {\n    ...ProductFragment\n    __typename\n  }\n  title\n  __typename\n}\n\nfragment ProductFragment on RVWebCommonProduct {\n  badges {\n    ...BadgesFragment\n    __typename\n  }\n  capacity\n  cityID\n  currencyCode\n  description\n  detailedDescription\n  discountPrimary\n  displayName\n  estimatedTripTime\n  etaStringShort\n  fare\n  fareAmountE5\n  hasPromo\n  hasRidePass\n  id\n  is3p\n  isAvailable\n  legalConsent {\n    ...ProductLegalConsentFragment\n    __typename\n  }\n  meta\n  preAdjustmentValue\n  productImageUrl\n  productUuid\n  reserveEnabled\n  __typename\n}\n\nfragment ProductLegalConsentFragment on RVWebCommonProductLegalConsent {\n  header\n  image {\n    url\n    width\n    __typename\n  }\n  description\n  enabled\n  ctaUrl\n  ctaDisplayString\n  buttonLabel\n  showOnce\n  __typename\n}\n"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch("https://m.uber.com/go/graphql", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        return parseRidesData(result);
      })
      .catch(error => console.log('error', error));
  }

  const fetchAddressSuggestions = async (query, setSuggestions) => {
    if (query && (Date.now() - lastRequestTime) >= 1000) { // 60 seconds
      setLastRequestTime(Date.now());
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    }
  };

  const handleSelectSuggestion = (item, setInput, setShowModal, setLat, setLon) => {
    setInput(item.display_name);
    setLat(parseFloat(item.lat));
    setLon(parseFloat(item.lon));
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal presentationStyle='pageSheet' onRequestClose={()=> setShowResults(false)} visible={showResults}>
       <SafeAreaView style={styles.container}>
         {displayUberData(uber)}
         //{displayLyftData(lyft)}
         //{displayTranistData(transit)}
       </SafeAreaView>
      </Modal>

      <View style={styles.searchContainer}>

        { !showFromModal &&
        <TouchableOpacity onPress={() => setShowFromModal(true)} style={styles.inputTouchable} visible={showFromModal}>
          <Text style={styles.inputText} visible={!showFromModal}>{from || 'From'}</Text>
        </TouchableOpacity>
        }
        { !showToModal &&
        <TouchableOpacity onPress={() => setShowToModal(true)} style={styles.inputTouchable} visible={showToModal}>
          <Text style={styles.inputText} visible={!showFromModal}>{to || 'To'}</Text>
        </TouchableOpacity>
        }

        <Modal
          visible={showFromModal}
          onRequestClose={() => setShowFromModal(false)}
          transparent={true}
          
        >
          <SafeAreaView style={styles.modalContainer}>
            <TextInput
              style={styles.modalInput}
              onChangeText={(text) => {
                setFrom(text);
                fetchAddressSuggestions(text, setFromSuggestions);
              }}
              value={from}
              placeholder="From"
            />
            <FlatList
              data={fromSuggestions}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectSuggestion(item, setFrom, setShowFromModal, setFromLat, setFromLon)}>
                  <Text style={styles.suggestionItem}>{item.display_name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          </SafeAreaView>
        </Modal>
        <Modal
  visible={showToModal}
  onRequestClose={() => setShowToModal(false)}
  transparent={true}
>
  <SafeAreaView style={styles.modalContainer}>
    <TextInput
      style={styles.modalInput}
      onChangeText={(text) => {
        setTo(text);
        fetchAddressSuggestions(text, setToSuggestions);
      }}
      value={to}
      placeholder="To"
    />
    <FlatList
      data={toSuggestions}
      keyExtractor={(item) => item.place_id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelectSuggestion(item, setTo, setShowToModal, setToLat, setToLon)}>
          <Text style={styles.suggestionItem}>{item.display_name}</Text>
        </TouchableOpacity>
      )}
      style={styles.suggestionsList}
    />
  </SafeAreaView>
</Modal>

        {/* Implement a similar Modal for "To" field */}
      </View>

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {fromLat && fromLon && (
          <Marker
            coordinate={{
              latitude: fromLat,
              longitude: fromLon
            }}
            title={"From Location"}
          />
        )}
        {toLat && toLon && (
          <Marker
            coordinate={{ 
              latitude: toLat, 
              longitude: toLon 
            }}
            title={"To Location"}
          />
        )}
         {fromLat && fromLon && toLat && toLon && (
          <Polyline
            coordinates={[
              { latitude: fromLat, longitude: fromLon },
              { latitude: toLat, longitude: toLon }
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={['#4285F4']}
            strokeWidth={6}
          />
        )}
      </MapView>

<View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.routeButton}
          onPress={async() => {
            getLyft(fromLat, fromLon, toLat, toLon).then((result) => {
              console.log(result);
              setUber(JSON.stringify(result));
            })
            setShowResults(true)

          }}
        >
          <Text style={styles.buttonText}>Search Routes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  inputTouchable: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  inputText: {
    // Styles for the "From" and "To" placeholder text
  },
  modalContainer: {
    marginTop: 70,
    marginHorizontal: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestionsList: {
    // Styles for the suggestions list
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // Adjust additional styles as needed
  },
  map: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  routeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontweight: 'bold',
    fontsSize: 24,
    marginBottom: 10,
  }
});
export default Dashboard;

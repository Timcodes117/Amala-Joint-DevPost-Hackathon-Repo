import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Search, FilterIcon, MapPin } from 'lucide-react-native'
import RoundButton from '../../components/buttons/rounded_button'
import FilterBottomSheet, { FilterBottomSheetRef } from '../../components/home_screen/FilterBottomSheet'
import { color_scheme } from '../../utils/constants/app_constants'
import { global_style } from '../../utils/stylesheets/general_style'
import Constants from 'expo-constants'
import { input_style } from '../../utils/stylesheets/input_style'
import { useAppContext } from '../../contexts/app'

const SearchSceen = () => {
    const { googlePlacesApi } = useAppContext();
    const filterBottomSheetRef = React.useRef<FilterBottomSheetRef>(null);

    const [searchInput, setSearchInput] = React.useState<string>("")

    const handleApplyFilters = (filters: any) => {
        console.log('Applied filters:', filters);
        // Here you would implement your filtering logic for search results
    };

    const filteredResults = React.useMemo(() => {
        if (!googlePlacesApi?.results) return [];
        if (!searchInput) return googlePlacesApi.results;

        return googlePlacesApi.results.filter((data) =>
            data.name.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [searchInput, googlePlacesApi]);

    return (
        <SafeAreaView style={{
            flex: 1, paddingHorizontal: 16, paddingTop: 16, ...{
                flexGrow: 1,
                // paddingTop: Constants.statusBarHeight,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: color_scheme.light
                // alignItems: "center",
            }
        }}>
            <View style={{ flexDirection: "row", gap: 10, width: "100%", }}>
                <TouchableOpacity onPress={() => router.push("/home_screen/search")}
                    style={[{ flexDirection: "row", gap: 10, flexGrow: 1, alignItems: "center", height: 48, backgroundColor: color_scheme.borderless, padding: 10, borderRadius: 100 }]}>
                    <Search size={24} color={color_scheme.placeholder_color} />
                    <TextInput placeholder='enter your desired location'
                        value={searchInput}
                        autoFocus={true}
                        onChangeText={(value) => setSearchInput(value)}
                        style={[global_style.text, input_style.input_text,
                        {
                            height: 48, flex: 1
                        }]}
                    />
                </TouchableOpacity>
                <RoundButton 
                    onTap={() => filterBottomSheetRef.current?.present()} 
                    overrideStyle={{ borderWidth: 0, backgroundColor: color_scheme.borderless, padding: 10, height: 48, minWidth: 48 }}
                >
                    <FilterIcon size={20} color={color_scheme.placeholder_color} />
                </RoundButton>
            </View>

            <FlatList
                data={filteredResults}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                  
                    onPress={() => router.push({
                      pathname: "/home_screen/details",
                      params: { data: JSON.stringify(item) }
                    })}
                        style={{
                            width: "100%",
                            height: 50,
                            gap: 10,
                            marginTop: 5,
                            borderBottomColor: color_scheme.grey_bg,
                            borderBottomWidth: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <MapPin size={20} color={color_scheme.link_color} />
                        <Text style={[global_style.text, { color: color_scheme.link_color }]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Filter Modal */}
            <FilterBottomSheet
              ref={filterBottomSheetRef}
              onApplyFilters={handleApplyFilters}
            />

        </SafeAreaView>
    )
}

export default SearchSceen
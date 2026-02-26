import { View, Text, FlatList } from 'react-native'
import React, { use, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { Image } from 'expo-image'



type Product = {
  id: number,
  title: string,
  description: string,
  price: number,
  thumbnail: string,
  rating: number,
  brand: string,
  category: string,
  stock: number,
  discountPercentage: number
}

export default function index() {

  const [data, setData] = React.useState([])

  const theme = useColorScheme()
  const isDarkMode = theme === 'dark' ? true : false


  const ITEM_HEIGHT = 350
  const IMG_HEIGHT = 240


  const fetchData = async () => {
    try {
        const res = await fetch("https://dummyjson.com/products")
        const json = await res.json()
       console.log(json)
       setData(json.products)
    } catch (error) {
      
    }
  }

  
  
  React.useEffect(() => {
    fetchData()
  }, [])
  
    const ProductCards = React.memo(({ item }: { item: Product }) => {
      return (
        <View key={item.id} style={{ padding: 10, backgroundColor: isDarkMode ? "#333" : "#eee", marginBottom: 20, borderRadius: 10 , 
          height: ITEM_HEIGHT,

        }}>
          <Image
          source={{uri :item.thumbnail}} 
          style={{ width: '100%', height: IMG_HEIGHT, borderRadius: 5, marginBottom: 10 }}
          cachePolicy={"memory-disk"}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={200}
          contentFit="contain"
          />
          <Text style={{ color: isDarkMode ? "#fff" : "#000", fontWeight: 'bold', fontSize: 16 }} numberOfLines={1}>{item.title}</Text>
          <Text style={{ color: isDarkMode ? "#ccc" : "#666", fontSize: 12, marginTop: 4 }} numberOfLines={2}>{item.description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: isDarkMode ? "#4ade80" : "#16a34a", fontWeight: 'bold', fontSize: 18 }}>${item.price}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: isDarkMode ? "#fbbf24" : "#f59e0b", fontSize: 14 }}>rating : {item.rating.toFixed(1)}</Text>
   
            </View>
          </View>
        </View>
      )
    })




  return (
 <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: isDarkMode ? "#000" : "#fff"}}>

    <Text style={{ color: isDarkMode ? "#fff" : "#000"}}>Flatlist Optimization</Text>


    <FlatList
      data={data}
      style={{ width: '100%', padding: 10 }}
      contentContainerStyle={{ paddingBottom: 40 , 
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item.id.toString() || index.toString()}
      renderItem={ useCallback(({ item }:any) => <ProductCards item={item}  />, [])}
      initialNumToRender={10}
      getItemLayout={
        (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })
      }
      maxToRenderPerBatch={12}  
      windowSize={5}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
    />


 </SafeAreaView>
  )
}
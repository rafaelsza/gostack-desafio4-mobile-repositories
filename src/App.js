import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking
} from "react-native";

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
IconAntDesign.loadFont();
IconMaterial.loadFont();

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Repository ${repositories.length + 1}`,
      url: "https://github.com/rafaelsza/js-starter-rocketseat",
      techs: ["Android SDK", "Node", "React", "Express", "Babel", "WebPack"]
    });

    if (response.status === 200) {
      const repository = response.data;

      setRepositories([...repositories, repository]);
    }
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const indexRepo = repositories.findIndex(repo => repo.id === id);

    repositories[indexRepo] = response.data;

    setRepositories([...repositories]);
  }

  async function handleDeleteRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    const indexRepo = repositories.findIndex(repo => repo.id === id);

    if (response.status === 204) {
      repositories.splice(indexRepo, 1);
      setRepositories([...repositories]);
    }
  }

  async function handleOpenURL(url){
    await Linking.openURL(url); 
  }

  function compareLikes(likes) {
    switch (likes) {
      case 0:
        return 'Ninguém curtiu ainda. Seja o primeiro!';
      case 1:
        return `${likes} curtida`;
      default:
        return `${likes} curtidas`;
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (

            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>
                {repository.title}
              </Text>

              {/* <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}                
              </View> */}

              <FlatList
                data={repository.techs}
                keyExtractor={tech => tech}
                style={styles.techsContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: tech }) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                )}
              />

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {compareLikes(repository.likes)}
                </Text>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.buttonLike}
                  activeOpacity={0.7}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <IconAntDesign name="like1" size={15} color="white" style={styles.iconButtons} />
                  <Text style={styles.buttonText}>
                    Curtir
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonGithub}
                  activeOpacity={0.7}
                  onPress={() => handleOpenURL(repository.url)}
                >
                  <IconAntDesign name="github" size={15} color="white" style={styles.iconButtons} />
                  <Text style={styles.buttonText}>
                    GitHub
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonDelete}
                  activeOpacity={0.7}
                  onPress={() => handleDeleteRepository(repository.id)}
                >
                  <IconMaterial name="delete" size={18} color="white" style={styles.iconButtons} />
                  <Text style={styles.buttonText}>
                    Remover
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.buttonAdd}
          activeOpacity={0.7}
          onPress={() => handleAddRepository()}
        >
          <IconMaterial name="add-box" size={15} color="white" style={styles.iconButtons} />
          <Text style={styles.buttonText}>
            Adicionar repositório
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "black",
    borderRadius: 3,
  },

  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },

  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },

  buttonLike: {
    marginRight: 10,
    backgroundColor: "#365ec2",
    borderRadius: 3,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonGithub: {
    backgroundColor: "black",
    borderRadius: 3,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDelete: {
    marginLeft: 10,
    backgroundColor: "#d11f43",
    borderRadius: 3,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonAdd: {
    marginHorizontal: 15,
    marginVertical: 15,
    backgroundColor: '#2b8c4c',
    borderRadius: 5,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
  },

  buttonText: {
    marginHorizontal: 10,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
  },

  iconButtons: {
    marginLeft: 10,
  }
});

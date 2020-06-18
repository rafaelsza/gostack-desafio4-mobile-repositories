import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const indexRepo = repositories.findIndex(repo => repo.id === id);

    repositories[indexRepo] = response.data;

    setRepositories([...repositories]);
  }

  async function handleDeleteRepository(id){
    const response = await api.delete(`repositories/${id}`);

    const indexRepo = repositories.findIndex(repo => repo.id === id);

    if(response.status === 204){
      repositories.splice(indexRepo, 1);
      setRepositories([...repositories]);
    }
  }

  function compareLikes(likes) {
    switch(likes){
      case 0:
        return 'Ninguém curtiu ainda. Seja o primeiro!';
      break;
      case 1:
        return `${likes} curtida`;
      break;
      default:
        return `${likes} curtidas`
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

              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}                
              </View>

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
                  style={styles.button}
                  activeOpacity={0.7}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>
                    
                    Curtir
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.7}
                  onPress={() => handleDeleteRepository(repository.id)}
                >
                  <Text style={styles.buttonDeleteText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
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
    color: "#fff",
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
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    width: 'auto',
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },

  buttonDeleteText: {
    fontSize: 14,
    width: 'auto',
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#e8254f",
    padding: 15,
  },

  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  }
});

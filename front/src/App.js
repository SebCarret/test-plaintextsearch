import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { AutoComplete, Input, List, Spin, Tag, Typography } from 'antd';
import { LoadingOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = AutoComplete;
const { Text } = Typography;

function App() {

  const [results, setResults] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [choice, setChoice] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      let coursesList = await fetch('/all-courses');
      let body = await coursesList.json();
      let finalBody = [];
      for (let i = 0; i < body.length; i++){
        for (let j = 0; j < body[i].course.length; j++){
          finalBody.push(body[i].course[j].title)
          for (let content of body[i].course[j].content){
            finalBody.push(content)
          }
        }
      };
      setOptions(finalBody)
    };
    loadCourses()
  }, []);

  const onResultClick = async (value) => {
    console.log(value);
    setIsLoading(true)
    setChoice(value);
    let list = await fetch(`/search-course?search=${value}`);
    let finalList = await list.json();
    setSearchList(finalList.results);
    setIsLoading(false)
  };

  // console.log(choice);
  // console.log(searchList);

  const handleSearch = (value) => {

    let searchResults = [];

    if (value) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].toUpperCase().indexOf(value.toUpperCase()) !== -1) {
          searchResults.push({ value: options[i] })
        }
      }
    } else {
      searchResults = []
    };

    setResults(searchResults)
  };

  return (
    <div style={styles.root}>
      {
        options.length === 0
          ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          : <AutoComplete
              style={{ width: 500 }}
              placeholder="Your search"
              allowClear={true}
              onSearch={handleSearch}
              onSelect={onResultClick}
              options={results}
            />
      }
      {/* <Input 
            placeholder="Your search"
            onChange={(e) => setSearch(e.target.value)} 
        /> */}
      {/* {results.map((result) => (
          <Option key={result} value={result}>
            {result.value}
          </Option>
        ))}
      </AutoComplete> */}
      {
        choice !== ""
          ? <h1 style={{ margin: "20px 0px" }}>Vos résultats de recherche pour : {choice}</h1>
          : null
      }
      <div style={{ display: "flex", justifyContent: "center" }}>
        {
          searchList.length !== 0
            ? <List
              style={{ width: 500 }}
              dataSource={searchList}
              renderItem={item => (
                <List.Item>
                  {
                    choice === item.course[0].title
                    ? <Text type="danger">{item.course[0].title}</Text>
                    : <Text>{item.course[0].title}</Text>
                  }
                  <div style={{display: "flex"}}>
                    {
                      item.course[0].content.map((tag, i) => (
                        <Tag 
                          key={`tag-${i+1}`}
                          style={choice === tag ? {color: "#F95457"} : null}
                        >
                          {tag}
                        </Tag>
                      ))
                    }
                  </div>
                </List.Item>
              )}
            />
            : isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : null
        }
      </div>
    </div>
  );
};

const styles = {
  root: {
    width: "100%",
    height: "100vh",
    margin: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  }
}

export default App;

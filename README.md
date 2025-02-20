# NC-Parcel-Search

**NC-Parcel-Search** is a web application designed to enhance the accessibility and usability of North Carolina's parcel data. By leveraging the [NC OneMap](https://www.nconemap.gov/) Parcel ArcGIS services, this tool enables users to query a broader range of fields than the official website allows, providing a more comprehensive search experience.

## Features

- **Advanced Parcel Search**: Query parcels using an expanded set of fields, offering more flexibility and detail in search criteria.
- **Interactive Map Interface**: Visualize parcel data on an interactive map, allowing for intuitive navigation and exploration.
- **Detailed Parcel Information**: Access in-depth information about selected parcels, including ownership details, assessed values, and more.

## Motivation

The primary goal of this project is to provide users with a more robust tool for accessing North Carolina's parcel data. By offering advanced search capabilities and a user-friendly interface, NC-Parcel-Search aims to bridge the gap between available data and user needs. Future plans include transitioning to a dedicated database solution to improve speed, reliability, and to mitigate potential API rate limits associated with direct calls to NC OneMap's services.

## Installation

To set up the project locally:

1. **Clone the repository**:
    
    ```bash
    git clone https://github.com/pdiegel/NC-Parcel-Search.git
    cd NC-Parcel-Search
    ```
    
2. **Install dependencies**:
    
    ```bash
    npm install
    ```
    
3. **Start the development server**:
    
    ```bash
    npm run dev
    ```
    The application should now be running locally.
    

## Deployment

The application is currently hosted on Vercel and can be accessed at [https://nc-parcel-search.vercel.app/](https://nc-parcel-search.vercel.app/). For information on deploying updates or setting up your own instance, refer to Vercel's deployment documentation.

## Data Source

This application utilizes the [NC OneMap](https://www.nconemap.gov/) Parcel ArcGIS services, which provide comprehensive geospatial datasets representing parcel boundaries and associated attributes from North Carolina county data producers and the Eastern Band of Cherokee Indians. For more details on the data and its attributes, visit the [NC OneMap Parcels page](https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/FeatureServer/1).

## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please open an issue or submit a pull request. Ensure that your contributions align with the project's goals and adhere to the established coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/pdiegel/NC-Parcel-Search/blob/main/LICENSE) file for more details.

## Acknowledgments

- [NC OneMap](https://www.nconemap.gov/) for providing accessible and authoritative geospatial data.

_Note: This project is a work in progress. Features and functionalities are subject to change as development continues._

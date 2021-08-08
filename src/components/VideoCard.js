import './VideoCard.css'

export const VideoCard = ({video}) => {
  
    return (
      <div
        className="card-layout"
      >
        <div className="card-container">
          <img src={video?.thumbnailUrl} className="card-img" alt="img" />
          <div className="card-flex">
            <img src={video?.authorImgUrl} className="card-logo-img" alt="img" />
            <div className="card-detail">
              <div className="card-title">{video?.name}</div>
              <div className="card-info">{video?.date}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
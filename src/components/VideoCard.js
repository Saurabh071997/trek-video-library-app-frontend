import './VideoCard.css'

export const VideoCard = ({
    video: { name, date, thumbnailUrl, authorImgUrl }
  }) => {
  
    return (
      <div
        className="card-layout"
      >
        <div className="card-container">
          <img src={thumbnailUrl} className="card-img" alt="img" />
          <div className="card-flex">
            <img src={authorImgUrl} className="card-logo-img" alt="img" />
            <div className="card-detail">
              <div className="card-title">{name}</div>
              <div className="card-info">{date}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
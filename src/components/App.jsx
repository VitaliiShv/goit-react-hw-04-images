import { useState, useEffect } from 'react';
import css from './App.module.css';
import { searchImages } from 'shared/api/image-api';
import Modal from '../shared/components/Modal/Modal';
import Loader from '../shared/components/Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [bigImg, setBigImg] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      const fetchImages = async () => {
        try {
          setLoading(true);
          const hits = await searchImages(searchQuery, page);
          setImages(prevImages => [...images, ...hits]);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchImages();
    }
  }, [searchQuery, page]);

  const handleFormSubmit = ({ searchQuery }) => {
    setSearchQuery(searchQuery);
    setPage(1);
    setImages([]);
  };

  const showBigImg = ({ largeImageURL, alt }) => {
    setBigImg({ largeImageURL, alt });
    setShowModal(true);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const closeModal = () => {
    setShowModal(false);
    setBigImg(null);
  };

  // const { images, loading, error, showModal, bigImg } = this.state;

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleFormSubmit}></Searchbar>
      <ImageGallery showBigImg={showBigImg} images={images}></ImageGallery>
      {loading && <Loader />}
      {error && <p>{error}</p>}
      {Boolean(images.length) && (
        <Button buttonText="Load More" onClickButton={loadMore}></Button>
      )}
      {showModal && (
        <Modal onClose={closeModal}>
          <img src={bigImg.largeImageURL} alt={bigImg.alt} />
        </Modal>
      )}
    </div>
  );
};

export default App;

/*
export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    loading: false,
    error: null,
    page: 1,
    showModal: false,
    bigImg: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;
    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.fetchImages();
    }
  }

  async fetchImages() {
    try {
      this.setState({ loading: true });
      const { searchQuery, page } = this.state;
      const hits = await searchImages(searchQuery, page);
      this.setState(({ images }) => ({ images: [...images, ...hits] }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleFormSubmit = ({ searchQuery }) =>
    this.setState({ searchQuery, page: 1, images: [] });

  loadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  showBigImg = ({ largeImageURL, alt }) => {
    this.setState({
      bigImg: { largeImageURL, alt },
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false, bigImg: null });
  };

  render() {
    const { images, loading, error, showModal, bigImg } = this.state;
    const { handleFormSubmit, loadMore, showBigImg, closeModal } = this;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={handleFormSubmit}></Searchbar>
        <ImageGallery showBigImg={showBigImg} images={images}></ImageGallery>
        {loading && <Loader />}
        {error && <p>{error}</p>}
        {Boolean(images.length) && (
          <Button buttonText="Load More" onClickButton={loadMore}></Button>
        )}
        {showModal && (
          <Modal onClose={closeModal}>
            <img src={bigImg.largeImageURL} alt={bigImg.alt} />
          </Modal>
        )}
      </div>
    );
  }
}
*/

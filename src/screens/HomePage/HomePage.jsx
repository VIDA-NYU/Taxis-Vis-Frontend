import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DuckDBContext } from '../../providers/DuckDB/DuckDBProvider';
import ConfigModal from '../../components/ConfigModal/ConfigModal';
import './HomePage.styles.css';

const features = [
  {
    category: 'Geo-Spatial Features',
    details: [
      '✅ – Spatial Selections (Pickup or Dropoff zones via polygon drawings)',
      '✅ – Spatial Queries (Pickup to Dropoff zones, directional lines, time ranges)',
      '⏳ – Grouping Queries –Infrastructure supports this capability but yet to be done.',
    ],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { handleConfigSelected } = useContext(DuckDBContext);
  const [showModal, setShowModal] = useState(false);

  const handleExploreClick = () => {
    setShowModal(true);
  };

  const handleConfigDone = async (userSelectedConfig) => {
    await handleConfigSelected(userSelectedConfig);
    setShowModal(false);
    navigate('/explore');
  };

  return (
    <div className='homepage-container'>
      <div className='homepage-card'>
        <div className='homepage-card-left'>
          <img
            src='/resources/taxis_vis.png'
            alt='Taxi Icon'
            className='homepage-card-image'
          />
        </div>
        <div className='homepage-card-right'>
          <h1 className='homepage-card-title'>Taxis Vis Reproduction</h1>
          <p className='homepage-card-description'>
            A Proof Of Concept Of The Taxis Vis paper, available{' '}
            <a href='https://ieeexplore.ieee.org/abstract/document/6634127'>
              here
            </a>
            , yet using <i>today tools</i> 🚖
          </p>
          <div className='homepage-card-features'>
            {features.map((feature, idx) => (
              <div key={idx} className='homepage-feature-category'>
                <h3>{feature.category}</h3>
                <ul>
                  {feature.details.map((detail, detailIdx) => (
                    <li key={detailIdx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='homepage-card-avatars'>
            <img
              src='https://avatars.githubusercontent.com/u/32747568?v=4'
              alt='Simon Provost'
            />
            <img
              src='data:image/webp;base64,UklGRvAWAABXRUJQVlA4IOQWAAAQlwCdASo4ATgBPoVAm0klJC8kJzM6aeAQiWVuvTU48afRIGibfMHY9+kfx+fA8S8W9UWi6Ir5gH6i9RjzdNmlZ9ck9/O7H9441CSp5vxS1PM9J/8eDeTptxMLbuqHuQvQA2iO06nDI7q0+OPbDuihG4Hu3/UEiJSxFCWE0RlFh/nm/7bw3wHnHyZUdOJvrINI20P3bQRaSZp3Cuwr4jnZM/VifV2op9676m31hoB73mR2YUCGSMqnpbDGOkvmZKjKCna/SwUV85pvivvE1HlhcJFou/rt2Ol/M8YIRQOlg1YqNx1Mx2pIXgI2b7UHLcLilpv5T5rkCJWZlZ31RlnS4lhGmDvWAZB0PDd9/4mEs/a+F7OqwSg5oBnfwN/TdYLG9RB8QqNKll3t63QAFwLXzuCrf4dbBEytPTisIyF+ojtAuAerRwT7ePwfCPTDAZcnzM71oKy8brzhk7RMUOWJjt9qzs6ItXl1kjRCX2ENRWrWRG759Vi3/keWNT4iWdiwh+aihfQEuQXJRirTwkW1qrRbdul9TMCWcDEVi40M5wjL0i5kutWTyseCxTZuUCbj//ZIA7CbLELg2tN6U7kcyZZ4RxU75XJoX8y3S8HyB1qme3plLMf3FJGL3CAwwnbrUio5uyJ/6vD/6ceKK1sCZgDAQY9bvpDDms2g1YlEKD4lOG7uBDhQJg57fH2qxsvOLpJbFpvGS6wXGsulwoS0CQ/DZpxLbcVz1exvo49LaSnT9qmzEkySy6fRBRMbEgiqnrc2w38iNrJZw/BcdYELGYPHJglMh6x3gYL7jodA9bYz2oL/7wqVWY3AICCJG0z8UqeslDt+Vk8CEdqyyvbCfnroPti5PjgVlxLSUin4jTVIFXz6EgKPHvlUnGhVGCkK555y+OdLD4nr6Sm12KaJpcolLPvbDaYUkiIV12v01aZW8d1QStYO90TS6OL6U6T+2LMNbGki8Lzb6MIwF94xZwKW8/QpL722Uivqeb8NBB9EmdmitaYQDh9J/Dryek/SAdjQOw77cEnEhjchuN6aLtS1lXL++m5bBjFE81HRMLKgMqZkvAaO1MeD4u2K8U14yILC87LGd+lz5ecjECujTDsNICGlvTsAlEzN+Cz9UemKtWKfKLy45jYolbePx/wDa9HKT3wKjFBXn4N/4K9RNVWrKs1AUCZp5h+OadJouGgW6z6Qdf1xDI1dMabDE7BdCG9/YLSkPAYTrVq4TVHadnnWwneLgU7q/l71F9JSKFdEQfPE6vc5g8RTHHnuBdxqaXz0Xd04urAoPA2DAM46AJ/sbUtmt0Uxks3I+E+qGgZmkITziln9OgudjSPeUPvPkRKsHT7fdx/rAutYMLaLDSIHuYVQW8xwRNzFAI1EQferV1uk0dfCjqQ6HcVtsMEYAvtecXnO1Ak33qgmr2DLKug8hkt6N6jZUfE7zdq1w5vu3E3ANMuN9yODZn342GuI0POdaVlW3uzplReN1AJQyFXBeZQ436RvvIrGCPBz4plZpJTaGgCIXkxPF9UfiaaPZjRrs17u7d8idTEuBk9PpcNIT10DZ5LOSdZEy3zzG1yq4+Np+uw0SqoulsN6oxzI1xVlyj8mje7QaFu8t0cWAAD+7eBIO6ivWf6ejuqhdhgeYGoADFkWqAWTHsgaomjDDqqt+2GAfnKZ2OtBZcPwG7ivq1aUkYC4lEKU10rxsH0tdO5ICgNaE/4UTU0PzXRbhiUSKfxvagOgsuBO3gNrV/oqUlq7j9K7ZJ/Ngk0UhMNDlu0J4SxAAfCAl3x48ydLLhPH6cDnztBrf/Cukq/Ajx+nU26uR0s+dtFQQpXAHQCKAVpLJcYBdKyBoPAByIOyAcyNnjQX6f/vJOumJjVPR09MZT6eFzt/4KfCSiQ/DeAjHPpGeTp6Ev71TosEkWfWhIGlSvcExMFCULymaZlismz6ZyEh6TC+iJ8PCpb4trQPIZkJgbc3Pq5GwBZ4s1LlqkcMGMJDp1lCcuaQk2/xu6bpRg9UxE/imaJgbmmQABnaaONMPkM8YHB9VO1k99DH+wLRgjJIlVwNUnRUOVdO9LM/sWSMKn2arDAcAQZWslFd3riTOAt9H/sEnf0TyfCbnqebQGV/Z995X3W8OknoHteftaAJESEewnD/+R3oyhdk1RlKTLqZ6pVL2KP58Xfymr5QEjQ7CRWlrANZMiAAAvQNaUGMlXYz8TJEFLsevQVP7UgVyrvePN55iJRGzK6uKOv/9VuLO5X2VocY18W+QZTIsazBEsmdbnlHs3cekqEVw3w6pu0B2Mu4MLqtvk81aWQldQWwSgb0DK0+q9VFSAIbIZiF6N7h0ta1B0JtGODTW4i/+2sYZWKyD8T2HD8vQUn6W0Ay37ngaCt1V4dtIPMO1EpyBOpuX5H+3Djd1D7zN2t28C1Alinv7IeqgRkMtZXvzpT5D4qVylng9jmuMdSqJj+AnA42JXagAAOc0Fv6qu8i3HC0mSSxw/ghcC7S2kY0cJ0b448aXAD9IWCQOgdE2izzls0gnLVteiIsTF7xd0JgW/vb/k76D5Alrk/6j3aVaIsFSjK0bpxdIFXSwFvUz5a9jNNsh2AS7qp9mCkD7/1YF0s1F8yNEeBU3u5Fa0F2m7QLeg73L8/CcZqb/q9dmH8/OUWVGHVcx0b+m9299UtkDLCawOZfYI3zEA9PVUWslwISpQ3R3ogumq5JOisICHdVzKUmmSWG+ShzuHGpsQpDGVnERqw2wN8sBHYREd4gcptSH25TGjE4xk0aIP6de7NJywJmXP7FQV7kbXEWyPlcwV6cJVTyKMroiSZ/auzxlCjIf5T+2JKolQiHp9JxL624Xvdyg037/2L8OJM1m03cXA1jZUUqqsUxKRdNKDuyIwvcHhDLXfkoVVpf/h4hPRCfCc0ZmQLAPgSeZEvJiUQRbURcTacLilmBfzNS68Rrmzo2BZmWZyAh94xEPQCjwageCyMiSWn7owrWqnJs+WWHaEKrQgjff7oah9N9AH3FBEDgnGwGH47xq5VEqWz13KK3z8Z85r9hhrfoxYUW0MyH63ejG1jqmucTeqHpoprxRfdhbyAGr5pAVB12cs4sdEs6ryKaT4MIeibjWkJUDxZRiPmgbRnSucG70NGzYewp95owQ8QHQYVLsocrQBn1Q0/C7LP5x1ZhQxhCbD5VUf85E6ZBsAtrnfYwaB1oRk0p7W3lQTlc6bqE41EtQ8fAvEqxCTLYOpMJEpajom9XpS7xW2XR2afRCVpIYhqcbKAng3YBaPYOgR/0ok17iZql9bitjMREZW4aDUSarnnXgOMgvR6pS4SjdIZUiDfB4LadxeK2bnx1zDmYg5CNm2vdlOUoBJOFiNN3avR91hY1yNVkp0Pa+0RqTzHNOtnFBW0mvmgS0v3O4N50YoTM1Jzq1R4Cc/DGP9oT0uk0iY+1fKHCOPHEUFDyntPWgrN09SSKkaSm5LQ7QZfJhsA9AA6Iib2okiozj3BbR8CtTa2g4kbHKw8hDeAZNB1hY9J43oloGnIS38/fSbqpL9O9D3yTWYjUsxAI0cp9zoqaRzaF8UXb9EEB9ZGaGWOCokyHgk+1QKeyVDvzBhDCBYiAHMl+17gJSYzQEQVZ2U6raKORCIigLCMt69Y+XiSmekrjsA54zPtIt3NHtUmTCzo6NCx50RyqcXS4DsHl/y8udt+ByykZNKNSxN3sohjH2sJ6AFdwdxe4W1BMbHoN1HbrG2Ov/vGSVjI8xnu+tkr/NEhuJ/yhdi/A0ArRmAIEtZiIuTzAh8kLf41D3geSfKwQt+WuZ371NBI7/rH8SqJT6UWQViotYRRTggZgjn5DabTKRu3HhwDzFhHkw/XOQoHtII+JJDRWPuNfKImD6bWgIyLEiQe+UEWOS2tRoG/usdIRddtb4LSdqvZm77EWOTnaknutLB5CguWjA+aPDAOiJPFLy9DqKYDjG6yHDDMWrOYJeXOsLYmx1AarnJKYA/kUoMj2T5eIakln8BBAAhdyxI3NtlxxwUBRh03XT9SNcZoNFCJbr/8XqToFvctQLgQ7j60swKk7ggyXaFKlp+ufwmrLeFlYI6yufR821udKbZQ993PV5F/t0/14azJsvTHSY+z1yvKnQ2zPYk8zbXwXxbRDl4g2AXxRSlle/dFIkW7KFzz0t6Xy7XIWVVGO0dJs1sjN1vkqiA8qGw7gCg348v4lpeYfGz+JhZbMEN0Sd6z4wu+8iI0L5qpTl72P98EGqVQLg3ZN7+zYz2KzYc6ARpZ7TYAHoE+m3usiBulj0v6zwpshfri8EOdySNP7ZHiD9ARhg9uFzTXNG7ZqMqctD9kC+Gpbs35d0hMN7CUegyremH/s/mDVu8GRKuE/lvhnaBn9NU3ZJ+j6Z3ZjAGm87AYu4sxVFtCjD98Fbt8YYTUjLfwKXmWM8oowjZep+WFECZfCDCrS8DpZFXshm41DwpknBLGqOyzjIBm9wKxAPMXWQOuRYQaw2zexJFpKhAQg3UDYC4Ax+hEOKNRo9XB0QmFL2Nlus1N6jbYMtwiZqR5diY5+9zavULW3HWLDbm/QJ3jDR/913dBflN19WKAe8Ij6kkPpZVdqaPCOxp7Zg2Gd/IARfKjoa3f1Z3utPTMp1sv8Wyo1GvT1jHqBRFi9CMAYzSathxsL7lecqLhIJ22t70spSfb4wtGNrpC8RlH76LR2QAU+QzHKsMqfcbs79XFwlNaMBvwZ5gxEPC2c4yq4nYyg1nRY8PAAYb4xeBDkEtx6yFWrf4marGTkUXWG6Z4bHjPl5gkm9xnKoJl5R2KvvPg1i6uJROz5BJ7u3f7pxrfIXHrRtsJr60ZXMlksOq3G0KvFEcScLzE9zsqo4JEAG9Oqp6VbFUch1YELv7EvYiw+oOO+vcPgda+nGI0zGd3GiH5nw6D/tkpqo835HYiUIrnOIvISa9AtHm72Z1GvwdfNRIHgD1Adi8OuFrwjylKX/0i5fT7vjKLHllpdbxbwHdAlZ3x7x+49BOAT8kXCR4ygwAm04dz5E+DfRBNX3BM7eOz29nLR9g/ML3F/zXA1Giguuu+guKnyHJeXj7858cGJGacKcR7XXXuzesLm8mKcti/m3A5k9jSYmIkKirl5CJk2AIPObjqht0tDIK+oCU8z6snjv/EpEvY+743k08ilPzdDfylCuLtjuNEs2/mHV9dNiZz8VY/OXyszd+9ne36eyyb2RRL/OSVZ7dYxR8Ki7w9aGPT0/vYqDV68Wx+ExL35nCquaYEVW9SDPp7W339rbMbNWZuTyOIXyhjfbm0nP58E+3Ssyass5mrwPSqUUrSKgBWuqq0Vxv2wAjs7QAJnMA2y9Ln6d/EB0lWGq8fcqbjXJVtPY935tMWdpL8PWg3fkiE7eqgumzXq5FCKOKXXunEvminollRN/wrf3gIjM3clP27b5lkLEKnaTIks5Z1D/pDn6D8rwPF4ARZPqGdXsti7mynl7aMs0Nx7UdYWGP4Sgf7ZbwQQjmWK2omOEBk41GyuWKmlD4cCs0A0OWWNSlYlQiT0XIXaE2LsEPThnzhoYW4FjsVE8D/8jCFnvGk1pXdPjxbDaBGS+cDDr62AyF7VU1oQRpmXW/y/l7hm/RaykXIuMoS/1xF5E0HxYYMnTprc8nLW5bEinwkMEwtCTBhf3AL17cNr/3Mywbs5GOiUFozRRk2tXCXwI/p02SubKhZCrSZ03Occqi9vPag8aoTCLLlOVq23DejZbRJ/7KjR8sHINzfF2kzT2i37WU4xLIgt8Q2hXYcblwsBRBm3RS/pYTnZMGEbVnOllDwn8dwAC7amkTxQq6XLfNA+maZ4E4CF+BvzDkjVeWoxfIPgkWOH5heNMsTpCJlsQeteCnbBioVXdYQM23bv3bOcrJynplgBDBcP2dOmsqv8l/ndAfTZbQuwNlVRkP+630WQR0clKJBBX5mKXSgRfQPxaf+S5MJziPG+11HF5bCXRGHPP1Tpw4xjfBmwYHkYAAQYiQ8E7Fvo7Q3WX1HBfatxpeIENVd0ebKQGDZCYpxcV7IbVgujQs0nSmxkmbIGEULZPMoNZVYf0LCr/xST+iutOYjjG3E2l2X4+oCPRy6DimMB+MnEt43G9Uk00dcZZw1zbzM36igvuJTCXNI48k3J+lTIjUMtGrB5eyd2d15nmxZSpN9ytxxC7HYZtHnGO2P4ykz86abfSgOVWn5LYNEElePBLUkN8pokAA2CbJwNT5hTmX7V05wOpYalIKyQrdNxp/ADMOjpxNF02VWBcgsO/vxJ6DN1IzJ1Nd/XiQkjFS1laTlIwpyOjA25TexAu4xaCyGhxUkRl3VwpQtWxiz/J05gG+IC8IE+5bl3Af75mY7rUp1vFUMGUzdUYQkLTE0VTUNz5WM7ZYCcB4C/ox/i4g6B8K8f6aOuZSkk6qFwKv/cOgUZ37SnOQyOGQl7D4D5+0KWlPpDtDCvNitvN9XLa9KVc2Gxjcy3sRp/2aweD9LG1zQAuJEGHKngfJ0j9XN4Q3F+uFMDwSgZVIP3LbAZ3APKWIrxt+gm/fbjlwDWXYPYotMVkafC74HgPZ1tyhos3LFvSAa9Unhh6X6LYJc18sDlOKJ/T18T0x/GbVJhuEO5LFFjT9MKhXfRhXZVW2UB2RiV9fK2xhZyY/bMz4F0oDCtJc5yOaurMyDi4MKz2+x5zSvf3otp4BU9rcqvr1Pq4y7DOHAmJvX0YE8wI4oI+qZVAYNdTqRJzZBUgjF356i+o+P/125bt4Fj6fBsW96YE2XcIo8gYsi5tp/qBFj3KnohUIIqMi1u3iZulJnhht13wCYIez0xxLSCJnS++HAB8zpLFJGUvuBiCtM4o1xy0KKms18KlcwRUPcnGFuVloNUFtf2s8hoJ4JTIeddSb99COdyKEoYisigYWLXzYMIJoMOlZAL2EB0VcBeltKHDIA0a8jKjxUjdcvphLhGFHGjn6eDYTFUEssshrPdvPCNHsuOoR76fqC+ydW74DQDBeCBmAPMW6c/zNCVqW4GMq3vCant/Yu5u10t1gezc7fwt1J9WzoPYV2X2OsRZ3jcE4oL9pXS/oPWS8nT/LAdlyNfrEq76uZytu1uCJKlUvxugHCO2k1cH/u5xT+MLzNYm0BmRjRw3+xp/DMvODM/Cd62mPwiiKB6IGQcUAeEusm+Z8APxOTSYzCZJHRzkPyTYr8eB26hG/2mwfllZwfInOaZhm36VMkiJIvhHFG+R5eLnOKLDsRRyOEWsiZm6n91GTpaMUwug2k5cajEqu3SBRnb/rxEk72Jzs7XN7Vrhav/h1lma1y4Azv8jqSI059JH2Y5cmF1IdDAcfdqHn1Gde+EyaPL8dLeAs76+Ano0k5iMjcqwNO54r59vdTSOrgZDXU+Z7y9QxDN7geXa0doAP6funJWhR+vpTiA9ES1Oz2AM5KViN+mJelfj1enXna0DHBuhfIJQPBY1FoJ4yxiaE6WflxwetVUB3I+J6/Lbegb5Y0nh9bZxn/GJ8yxYKZMRKzS/DHHJtxBxvMXFtzfJ3lSUDgUlqFoSsUSoO4PJQHSxLSlfXOzxY+5u70fdS46qJBLbh3b/RDfGEJ05HzVhPSOy8igWFI3u3j0uk89Wd3px/5l9QkP9/7jssAsQLcYaFcPzIJLQF/4NFO03zs3RKiEMR73FSAK+sGqSJlwnaJJpJhSPk1ogrQOSde8fhFYY5ADwjiL6lmWVQXW2qRsNsz7i06sflQYbq5SsoqALbiVP15lamMdIshl6LRPiaXHHgvAwzZ21SoSfMUZvKQaPlH2uJRK9iRVvzh4zbu/F9x4AAAA'
              alt='Prof. Juliana Freire'
            />
            <img
              src='data:image/webp;base64,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'
              alt='Prof. Claudio Silva'
            />
            <img
              src='https://avatars.githubusercontent.com/u/7430591?v=4'
              alt='João Rulff'
            />
            <span>@ NYU VIDA</span>
          </div>
          <div className='homepage-card-actions'>
            <button
              className='homepage-card-button'
              onClick={handleExploreClick}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <ConfigModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfigSelected={handleConfigDone}
        />
      )}
    </div>
  );
};

export default HomePage;

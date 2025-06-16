import React from 'react'
import Header from '../component/Header'
import Steps from '../component/Steps'
import Descryption from '../component/Descryption'
import Testinomial from '../component/Testinomial'
import GenerateBtn from '../component/GenerateBtn'

function Home() {
  return (
    <div>
      <Header/>
      <Steps/>
      <Descryption/>
      <Testinomial/>
      <GenerateBtn/>
    </div>
  )
}

export default Home
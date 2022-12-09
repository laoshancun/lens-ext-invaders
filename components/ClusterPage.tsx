import "./ClusterPage.scss"
import React, { useEffect, useState } from "react";
import { observable ,IObservableArray} from "mobx";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import Game from "./Game";
import { Renderer } from "@k8slens/extensions";

const ClusterPage = (): JSX.Element => {

  console.info("🔥 Cluster page rendered");
  const [podsStore, updatePodsStore] = useState(Renderer.K8sApi.apiManager.getStore(Renderer.K8sApi.podsApi) as Renderer.K8sApi.PodsStore)
  const [namespaceStore] = useState(Renderer.K8sApi.apiManager.getStore(Renderer.K8sApi.namespacesApi) as Renderer.K8sApi.NamespaceStore);
  const pods = observable.array([]) as IObservableArray<Renderer.K8sApi.KubeObject<KubeObjectMetadata, any, any>>
  useEffect(() => {
    const ensure = async () => {
      namespaceStore.onContextChange(async ()=>{
        
        let loaded= await podsStore.reloadAll({
          namespaces: Array.from(namespaceStore.selectedNames),
          force: true,
          merge: true
        });
        console.log("change",namespaceStore.selectedNames,podsStore.getTotalCount());
        // let loaded=podsStore.getAllByNs(Array.from(namespaceStore.selectedNames));
        pods.splice(0,pods.length,...loaded)
        console.log("load pods: ",pods.length,loaded);
        podsStore.getTotalCount()
        updatePodsStore(podsStore);
      });

      if (!podsStore.isLoaded) {
        await podsStore.loadAll();
        podsStore.subscribe();
      }
      pods.spliceWithArray(0,pods.length,podsStore.getAllByNs(Array.from(namespaceStore.selectedNames)))
      console.log("ensure");
    }
    ensure();
  }, [podsStore])

  return (
    <Renderer.Component.TabLayout className="ClusterPage">
      <header className="flex gaps align-center">
        <h2 className="flex gaps align-center">
          <span>Space Invaders</span>
          <Renderer.Component.Icon material="info" tooltip="" />
        </h2>
        <div className="box right">
          <Renderer.Component.NamespaceSelectFilter id="test" />
        </div>
      </header>
      <Game pods={pods} />
    </Renderer.Component.TabLayout>
  );
}

export default ClusterPage

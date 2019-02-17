/** Geometric 3-D vector. */
class geomVector extends THREE.ArrowHelper {
    constructor(x,y,z, normalizedLength=1){
      let dir = new THREE.Vector3(x,y,z);
      dir.normalize();
      let origin = new THREE.Vector3(0,0,0);
      super(dir, origin, 200*normalizedLength, 0x00ffff);
    }  
  }